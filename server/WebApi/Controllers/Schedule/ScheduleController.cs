using Application.Common.Utils;
using Application.Common.Interface.Scheduling;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Domain.Entities.ScheduleTask;
using Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers.Schedule;

[Route("api/schedules")]
public class ScheduleController : ControllerBase
{
    private readonly ITaskItemService _taskItemService;
    private readonly IScheduleRequestRepository _scheduleRequestRepo;
    private readonly IAutoSchedulingBackgroundService _autoSchedulingBackgroundService;
    private readonly IScheduleServerlessService _serverless;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly ILogger<ScheduleController> _logger;

    public ScheduleController(
        ITaskItemService taskItemService,
        IScheduleRequestRepository scheduleRequestRepo,
        IAutoSchedulingBackgroundService autoSchedulingBackgroundService,
        IScheduleServerlessService serverless,
        IEmployeeRepository employeeRepository,
        ILogger<ScheduleController> logger
        )
    {
        _taskItemService = taskItemService;
        _scheduleRequestRepo = scheduleRequestRepo;
        _autoSchedulingBackgroundService = autoSchedulingBackgroundService;
        _serverless = serverless;
        _employeeRepository = employeeRepository;
        _logger = logger;
    }

    //Auto Scheduling
    /// <summary>
    /// FE gửi payload → server lưu DB → đẩy vào Hangfire queue → trả request_id ngay
    /// </summary>
    [HttpPost("auto")]
    [Authorize(Roles = "admin, hod")]
    public async Task<IActionResult> RunAutoSchedule([FromBody] RequestSchedulingDTO payload)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        UserAccount? user = await _employeeRepository.GetEmployeeByIdAsync(Guid.Parse(userId.ToString()));
        if (user == null)
            return new JsonResult(
                    new ApiResponse<string>(401,
                        "Không tìm thấy thông tin người dùng."))
            { StatusCode = 401 };

        _logger.LogInformation("AutoSchedule — User: {Name} (ID: {Id}), Department: {DeptName} (ID: {DeptId}), Role: {Role}",
            $"{user.Employee?.FirstName} {user.Employee?.LastName}",
            user.Employee?.Id,
            user.Employee?.Department?.Name,
            user.Employee?.DepartmentId,
            user.Employee?.RoleId);

        try
        {
            if (!DateOnly.TryParse(payload.StartDate, out var startDate))
                return new JsonResult(new ApiResponse<string>(400, "Định dạng ngày StartDate không hợp lệ. Vui lòng dùng định dạng yyyy-MM-dd.")) { StatusCode = 400 };

            // Validate doctors via Service
            var validationResult = await _taskItemService.ValidateSchedulingRequestAsync(payload, Guid.Parse(userId));
            if (!validationResult.IsSuccess)
            {
                return new JsonResult(new ApiResponse<string>(400, validationResult.Message)) { StatusCode = 400 };
            }

            // Chặn trùng khoảng thời gian đã xếp lịch (bỏ qua request failed)
            var numDays = Math.Max(payload.NumDays, 1);
            var endDate = startDate.AddDays(numDays - 1);
            var existingRequests = await _scheduleRequestRepo.GetByDepartmentIdAsync(user.Employee!.DepartmentId);
            var overlapping = existingRequests
                .Where(r => !r.Status.Equals(ScheduleEnum.FAILED.ToString(), StringComparison.OrdinalIgnoreCase))
                .FirstOrDefault(r => r.StartDate <= endDate && r.StartDate.AddDays(Math.Max(r.NumDays, 1) - 1) >= startDate);

            if (overlapping != null)
            {
                var overlapEnd = overlapping.StartDate.AddDays(Math.Max(overlapping.NumDays, 1) - 1);
                return new JsonResult(new ApiResponse<string>(400,
                    $"Đã có lịch tồn tại trong khoảng {overlapping.StartDate:dd/MM/yyyy} → {overlapEnd:dd/MM/yyyy}. Hãy chọn khoảng thời gian khác."))
                { StatusCode = 400 };
            }

            // Mặc định: dưới 5 năm kinh nghiệm là intern
            foreach (var doctor in payload.Doctors)
            {
                if (doctor.Experiences < 5)
                {
                    doctor.IsIntern = true;
                }
            }

            var scheduleRequest = new ScheduleRequest
            {
                Status = ScheduleEnum.QUEUED.ToString(),
                RequestPayload = System.Text.Json.JsonSerializer.Serialize(payload),
                DepartmentId = user.Employee!.DepartmentId,
                StartDate = startDate,
                NumDays = payload.NumDays,
                RequestedBy = user.Employee.Id,
                CreatedAt = DateTime.UtcNow
            };

            await _scheduleRequestRepo.AddAsync(scheduleRequest);

            // Đẩy vào background queue, trả về ngay không block
            var enqueueResult = _autoSchedulingBackgroundService.EnqueueAutoScheduling(scheduleRequest.Id);
            if (!enqueueResult.IsSuccess || string.IsNullOrWhiteSpace(enqueueResult.Data))
            {
                scheduleRequest.Status = ScheduleEnum.FAILED.ToString();
                scheduleRequest.ErrorMessage = enqueueResult.Message ?? "Không thể enqueue tác vụ.";
                await _scheduleRequestRepo.UpdateAsync(scheduleRequest);
                return new JsonResult(new ApiResponse<string>(500, enqueueResult.Message)) { StatusCode = 500 };
            }

            scheduleRequest.HangfireJobId = enqueueResult.Data;
            await _scheduleRequestRepo.UpdateAsync(scheduleRequest);

            return new JsonResult(new ApiResponse<ResponseSchedulingDTO>(202, "Yêu cầu xếp lịch đã được tiếp nhận", new ResponseSchedulingDTO
            {
                RequestId = scheduleRequest.Id.ToString()
            }))
            { StatusCode = 202 };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error starting auto schedule. Payload: {Payload}", System.Text.Json.JsonSerializer.Serialize(payload));
            return new JsonResult(new ApiResponse<string>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.")) { StatusCode = 500 };
        }
    }

    /// <summary>
    /// FE polling tiến độ → server relay thẳng từ serverless, không lưu gì
    /// </summary>
    [HttpGet("auto/{requestId}/progress")]
    [Authorize(Roles = "admin, doctor, hod")]
    public async Task<IActionResult> GetAutoScheduleProgress(string requestId)
    {
        try
        {
            if (!long.TryParse(requestId, out var id))
                return new JsonResult(new ApiResponse<string>(400, "requestId không hợp lệ.")) { StatusCode = 400 };

            var request = await _scheduleRequestRepo.GetByIdAsync(id);
            if (request?.ServerlessRequestId == null)
                return new JsonResult(new ApiResponse<string>(404, "Không tìm thấy request hoặc chưa có serverless ID.")) { StatusCode = 404 };

            var result = await _serverless.GetProgressAsync(request.ServerlessRequestId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting progress for requestId: {ReqId}", requestId);
            return new JsonResult(new ApiResponse<string>(500, "Không thể lấy tiến độ từ serverless.")) { StatusCode = 500 };
        }
    }

    /// <summary>
    /// FE lấy kết quả lịch → server relay thẳng từ serverless
    /// </summary>
    [HttpGet("auto/{requestId}/schedule")]
    [Authorize(Roles = "admin, hod")]
    public async Task<IActionResult> GetAutoScheduleResult(string requestId)
    {
        try
        {
            if (!long.TryParse(requestId, out var id))
                return new JsonResult(new ApiResponse<string>(400, "requestId không hợp lệ.")) { StatusCode = 400 };

            var request = await _scheduleRequestRepo.GetByIdAsync(id);
            if (request == null)
                return new JsonResult(new ApiResponse<string>(404, "Không tìm thấy request.")) { StatusCode = 404 };

            if (!string.IsNullOrWhiteSpace(request.ResultData))
            {
                return Content(request.ResultData, "application/json");
            }

            if (request.ServerlessRequestId == null)
                return new JsonResult(new ApiResponse<string>(404, "Không tìm thấy request hoặc chưa có serverless ID.")) { StatusCode = 404 };

            if (!request.Status.Equals(ScheduleEnum.COMPLETED.ToString(), StringComparison.OrdinalIgnoreCase))
            {
                var progress = await _serverless.GetProgressAsync(request.ServerlessRequestId);
                var status = progress.GetProperty("status").GetString() ?? string.Empty;

                if (status.Equals(ScheduleEnum.COMPLETED.ToString(), StringComparison.OrdinalIgnoreCase))
                {
                    request.Status = ScheduleEnum.COMPLETED.ToString();
                    request.ProgressPercent = 100;
                    request.ErrorMessage = null;
                    await _scheduleRequestRepo.UpdateAsync(request);
                }
                else if (status.Equals(ScheduleEnum.FAILED.ToString(), StringComparison.OrdinalIgnoreCase))
                {
                    var error = progress.TryGetProperty("error", out var e) ? e.GetString() : "Unknown error";
                    request.Status = ScheduleEnum.FAILED.ToString();
                    request.ErrorMessage = error;
                    await _scheduleRequestRepo.UpdateAsync(request);
                    return new JsonResult(new ApiResponse<string>(409, $"Xếp lịch thất bại: {error}")) { StatusCode = 409 };
                }
                else
                {
                    return new JsonResult(new ApiResponse<string>(409, "Lịch chưa sẵn sàng hoặc job đang chạy.")) { StatusCode = 409 };
                }
            }

            try
            {
                var result = await _serverless.GetScheduleAsync(request.ServerlessRequestId);
                return Ok(result);
            }
            catch (HttpRequestException ex) when (!string.IsNullOrWhiteSpace(request.ResultData))
            {
                _logger.LogWarning(ex, "Serverless schedule result unavailable for requestId: {ReqId}, fallback to persisted ResultData", requestId);
                return Content(request.ResultData, "application/json");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting schedule result for requestId: {ReqId}", requestId);
            return new JsonResult(new ApiResponse<string>(500, "Không thể lấy kết quả lịch từ serverless.")) { StatusCode = 500 };
        }
    }

    /// <summary>
    /// FE lấy chỉ số (metrics) của từng phương án Pareto → server relay thẳng từ serverless
    /// </summary>
    [HttpGet("auto/{requestId}/metrics")]
    [Authorize(Roles = "admin, hod")]
    public async Task<IActionResult> GetAutoScheduleMetrics(string requestId)
    {
        try
        {
            if (!long.TryParse(requestId, out var id))
                return new JsonResult(new ApiResponse<string>(400, "requestId không hợp lệ.")) { StatusCode = 400 };

            var request = await _scheduleRequestRepo.GetByIdAsync(id);
            if (request == null)
                return new JsonResult(new ApiResponse<string>(404, "Không tìm thấy request.")) { StatusCode = 404 };

            object BuildEmptyMetricsPayload() => new
            {
                request_id = requestId,
                algorithm_run_metrics = (object?)null,
                pareto_options = Array.Empty<object>()
            };

            if (!string.IsNullOrWhiteSpace(request.MetricsData))
            {
                return Content(request.MetricsData, "application/json");
            }

            if (request.ServerlessRequestId == null)
            {
                if (!string.IsNullOrWhiteSpace(request.ResultData))
                    return Ok(BuildEmptyMetricsPayload());

                return new JsonResult(new ApiResponse<string>(404, "Không tìm thấy request hoặc chưa có serverless ID.")) { StatusCode = 404 };
            }

            if (!request.Status.Equals(ScheduleEnum.COMPLETED.ToString(), StringComparison.OrdinalIgnoreCase))
                return new JsonResult(new ApiResponse<string>(409, "Lịch chưa sẵn sàng hoặc job đang chạy.")) { StatusCode = 409 };

            try
            {
                var metrics = await _serverless.GetMetricsAsync(request.ServerlessRequestId);
                request.MetricsData = metrics.GetRawText();
                await _scheduleRequestRepo.UpdateAsync(request);
                return Ok(metrics);
            }
            catch (HttpRequestException ex) when (!string.IsNullOrWhiteSpace(request.MetricsData))
            {
                _logger.LogWarning(ex, "Serverless metrics unavailable for requestId: {ReqId}, fallback to persisted MetricsData", requestId);
                return Content(request.MetricsData, "application/json");
            }
            catch (HttpRequestException ex) when (!string.IsNullOrWhiteSpace(request.ResultData))
            {
                _logger.LogWarning(ex, "Serverless metrics unavailable for requestId: {ReqId}, fallback to empty metrics payload", requestId);
                return Ok(BuildEmptyMetricsPayload());
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting metrics for requestId: {ReqId}", requestId);
            return new JsonResult(new ApiResponse<string>(500, "Không thể lấy chỉ số từ serverless.")) { StatusCode = 500 };
        }
    }


    /// <summary>
    /// FE lấy lịch sử xếp lịch tự động (lọc + phân trang)
    /// </summary>
    [HttpGet("auto/history")]
    [Authorize(Roles = "admin, hod")]
    public async Task<IActionResult> GetScheduleRequestHistory(
        int? departmentId = null,
        string? status = null,
        [FromQuery] DateOnly? fromDate = null,
        [FromQuery] DateOnly? toDate = null,
        int page = 1,
        int pageSize = 10)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            UserAccount? user = await _employeeRepository.GetEmployeeByIdAsync(Guid.Parse(userId.ToString()));
            if (user?.Employee == null)
                return new JsonResult(new ApiResponse<string>(401, "Không tìm thấy thông tin người dùng.")) { StatusCode = 401 };

            // HOD chỉ xem được lịch của khoa mình; admin có thể lọc theo khoa bất kỳ
            var isAdmin = User.IsInRole("admin");
            var deptId = isAdmin ? departmentId : user.Employee.DepartmentId;

            if (page < 1) page = 1;
            if (pageSize is < 1 or > 100) pageSize = 10;

            if (!string.IsNullOrWhiteSpace(status))
            {
                status = status.ToUpperInvariant();
                if (!Enum.GetNames(typeof(ScheduleEnum)).Contains(status, StringComparer.OrdinalIgnoreCase))
                    return new JsonResult(new ApiResponse<string>(400, "Trạng thái lọc không hợp lệ.")) { StatusCode = 400 };
            }

            var (items, total) = await _scheduleRequestRepo.GetPagedByFilterAsync(deptId, status, fromDate, toDate, page, pageSize);

            var response = new ResponseScheduleRequestHistoryDTO
            {
                Items = items.Select(r => new ResponseScheduleRequestHistoryItemDTO
                {
                    Id = r.Id,
                    DepartmentId = r.DepartmentId,
                    DepartmentName = r.Department?.Name ?? string.Empty,
                    RequestedBy = r.RequestedBy,
                    RequestedByName = r.Employee != null
                        ? $"{r.Employee.FirstName} {r.Employee.LastName}".Trim()
                        : string.Empty,
                    Status = r.Status,
                    StartDate = r.StartDate.ToString("yyyy-MM-dd"),
                    NumDays = r.NumDays,
                    ProgressPercent = r.ProgressPercent,
                    ServerlessRequestId = r.ServerlessRequestId,
                    ErrorMessage = r.ErrorMessage,
                    CreatedAt = r.CreatedAt
                }).ToList(),
                Total = total,
                Page = page,
                PageSize = pageSize
            };

            return new JsonResult(new ApiResponse<ResponseScheduleRequestHistoryDTO>(200, "Lấy lịch sử xếp lịch thành công", response)) { StatusCode = 200 };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting schedule history");
            return new JsonResult(new ApiResponse<string>(500, "Đã xảy ra lỗi khi lấy lịch sử xếp lịch.")) { StatusCode = 500 };
        }
    }


    // Manual Scheduling
    [HttpPost]
    [Authorize(Roles = "admin, hod")]
    public async Task<IActionResult> CreateSchedule([FromBody] RequestTaskItemDTO request)
    {
        try
        {
            var result = await _taskItemService.CreateTaskItemAsync(request, request.TaskRegistrations);
            if (result.IsSuccess)
                return new JsonResult(new ApiResponse<ResponseTaskItemDTO>(201, "Tạo lịch khám thành công", result.Data)) { StatusCode = 201 };
            return new JsonResult(new ApiResponse<string>(400, result.Message)) { StatusCode = 400 };
        }
        catch
        {
            return new JsonResult(new ApiResponse<string>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.")) { StatusCode = 500 };
        }
    }

    [HttpGet]
    [Authorize(Roles = "admin, doctor, hod")]
    public async Task<IActionResult> GetScheduleByEmployeeId(Guid empId)
    {
        try
        {
            ServiceResult<List<ResponseTaskItemDTO>>? result = await _taskItemService.GetTaskItemByEmployeeIdAsync(empId);
            if (!result.IsSuccess)
                return new JsonResult(new ApiResponse<string>(400, result.Message)) { StatusCode = 400 };
            return new JsonResult(new ApiResponse<List<ResponseTaskItemDTO>>(200, "Lấy lịch khám thành công", result.Data)) { StatusCode = 200 };
        }
        catch
        {
            return new JsonResult(new ApiResponse<string>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.")) { StatusCode = 500 };
        }
    }
}

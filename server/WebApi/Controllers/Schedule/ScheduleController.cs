using Application.Common.Utils;
using Application.Common.Interface.Scheduling;
using System.Security.Claims;
using Infrastructure.HangfireJobs;
using Infrastructure.Http;
using Microsoft.AspNetCore.Authorization;
using Hangfire;
using Domain.Entities.ScheduleTask;
using Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers.Schedule;

[Route("api/schedules")]
public class ScheduleController : ControllerBase
{
    private readonly ITaskItemService _taskItemService;
    private readonly IScheduleRequestRepository _scheduleRequestRepo;
    private readonly IBackgroundJobClient _backgroundJobClient;
    private readonly ScheduleServerlessService _serverless;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly ILogger<ScheduleController> _logger;

    public ScheduleController(
        ITaskItemService taskItemService,
        IScheduleRequestRepository scheduleRequestRepo,
        IBackgroundJobClient backgroundJobClient,
        ScheduleServerlessService serverless,
        IEmployeeRepository employeeRepository,
        ILogger<ScheduleController> logger
        )
    {
        _taskItemService = taskItemService;
        _scheduleRequestRepo = scheduleRequestRepo;
        _backgroundJobClient = backgroundJobClient;
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
                        "Không tìm thấy thông tin người dùng.")) { StatusCode = 401 };

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

            // Đẩy vào Hangfire, trả về ngay không block
            var hangfireJobId = _backgroundJobClient.Enqueue<AutoSchedulingHangfireJob>(
                job => job.ExecuteAsync(scheduleRequest.Id));

            scheduleRequest.HangfireJobId = hangfireJobId;
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
            if (request?.ServerlessRequestId == null)
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

            var result = await _serverless.GetScheduleAsync(request.ServerlessRequestId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting schedule result for requestId: {ReqId}", requestId);
            return new JsonResult(new ApiResponse<string>(500, "Không thể lấy kết quả lịch từ serverless.")) { StatusCode = 500 };
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

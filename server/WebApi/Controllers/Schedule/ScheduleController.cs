using Application.Common.Utils;
using Application.Common.Interface.Scheduling;
using System.Security.Claims;
using Infrastructure.HangfireJobs;
using Infrastructure.Http;
using Microsoft.AspNetCore.Authorization;
using Hangfire;
using Domain.Entities.ScheduleTask;
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

    public ScheduleController(
        ITaskItemService taskItemService,
        IScheduleRequestRepository scheduleRequestRepo,
        IBackgroundJobClient backgroundJobClient,
        ScheduleServerlessService serverless,
        IEmployeeRepository employeeRepository
        )
    {
        _taskItemService = taskItemService;
        _scheduleRequestRepo = scheduleRequestRepo;
        _backgroundJobClient = backgroundJobClient;
        _serverless = serverless;
        _employeeRepository = employeeRepository;
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
        UserAccount user = await _employeeRepository.GetEmployeeByIdAsync(Guid.Parse(userId.ToString()));
        if (user == null)
            return new JsonResult(
                    new ApiResponse<string>(401, 
                        "Không tìm thấy thông tin người dùng.")) { StatusCode = 401 };

        try
        {
            var scheduleRequest = new ScheduleRequest
            {
                Status = "queued",
                RequestPayload = System.Text.Json.JsonSerializer.Serialize(payload),
                DepartmentId = user.Employee!.DepartmentId,
                StartDate = DateOnly.Parse(payload.StartDate),
                NumDays = payload.NumDays,
                RequestedBy = user.Employee.Id,
                CreatedAt = DateTime.UtcNow
            };

            await _scheduleRequestRepo.AddAsync(scheduleRequest);

            // Đẩy vào Hangfire, trả về ngay không block
            _backgroundJobClient.Enqueue<AutoSchedulingHangfireJob>(
                job => job.ExecuteAsync(scheduleRequest.Id));

            return new JsonResult(new ApiResponse<ResponseSchedulingDTO>(202, "Yêu cầu xếp lịch đã được tiếp nhận", new ResponseSchedulingDTO
            {
                RequestId = scheduleRequest.Id.ToString()
            }))
            { StatusCode = 202 };
        }
        catch
        {
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
            var result = await _serverless.GetProgressAsync(requestId);
            return Ok(result);
        }
        catch
        {
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
            var result = await _serverless.GetScheduleAsync(requestId);
            return Ok(result);
        }
        catch
        {
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

using Application.Common.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers.Schedule;
[Route("api/schedules")]
public class ScheduleController : ControllerBase
{
    private readonly ITaskItemService _taskItemService;

    public ScheduleController(ITaskItemService taskItemService)
    {
        _taskItemService = taskItemService;
    }

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
            //if (result.IsSuccess)
                return new JsonResult(new ApiResponse<List<ResponseTaskItemDTO>>(200, "Lấy lịch khám thành công", result.Data)) { StatusCode = 200 };
            //return new JsonResult(new ApiResponse<string>(404, result.Message)) { StatusCode = 404 };
        }
        catch
        {
            return new JsonResult(new ApiResponse<string>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.")) { StatusCode = 500 };
        }
    }
}
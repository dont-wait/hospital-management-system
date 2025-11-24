using Application.Common.Utils;
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
}
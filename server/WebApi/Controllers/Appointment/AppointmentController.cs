using Application.Common.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers.Appointment;
[Route("api/appointments")]
[ApiController]
public class AppointmentController : ControllerBase
{

    private readonly ITaskItemService _taskItemService;
    private readonly IAppointmentService _appointmentService;
    public AppointmentController(ITaskItemService taskItemService, IAppointmentService appointmentService)
    {
        _taskItemService = taskItemService;
        _appointmentService = appointmentService;
    }

    [HttpPost]
    [Authorize(Roles = "admin, doctor, patient, nurse")]
    public async Task<IActionResult> CreateAppointment(RequestAppointmentDTO request)
    {
        try
        {
            var result = await _appointmentService.CreateAppointment(request);
            if (result.IsSuccess)
                return new JsonResult(new ApiResponse<ResponseAppointmentDTO>(201, "Đăng ký khám thành công", result.Data)) { StatusCode = 201 };
            return new JsonResult(new ApiResponse<string>(400, result.Message)) { StatusCode = 400 };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new JsonResult(new ApiResponse<string>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.")) { StatusCode = 500 };
        }
    }

    [HttpGet("available-slots")]
    [Authorize(Roles = "admin, doctor, patient, nurse")]
    public async Task<IActionResult> GetAvailableAppointments([FromQuery] DateOnly? date,
                                                            [FromQuery] int? departmentId,
                                                            [FromQuery] Guid? doctorId)
    {
        try
        {
            var result = await _taskItemService.GetAvailableAppointments(date,
                departmentId,
                doctorId);
            if (result.IsSuccess)
                return new JsonResult(new ApiResponse<ResponseAvailableAppointment>(200, "Lấy danh sách đăng ký khám hợp lệ thành công", result.Data)) { StatusCode = 200 };
            return new JsonResult(new ApiResponse<string>(400, result.Message)) { StatusCode = 400 };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new JsonResult(new ApiResponse<string>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.")) { StatusCode = 500 };
        }
    }
}
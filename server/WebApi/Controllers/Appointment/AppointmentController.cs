using Application.Common.Interface.Appointment;
using Application.Common.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers.Appointment;
[Route("api/appointments")]
public class AppointmentController : ControllerBase
{
    private readonly IAppointmentService _appointmentService;

    public AppointmentController(IAppointmentService appointmentService)
    {
        _appointmentService = appointmentService;
    }

    [HttpPost]
    [Authorize(Roles = "admin, doctor, patient, nurse")]
    public IActionResult CreateAppointment(RequestAppointmentDTO createAppointmentDto)
    {
        try
        {
            var result = _appointmentService.CreateAppointmentAsync(createAppointmentDto);
            if (result.Result.IsSuccess)
                return new JsonResult(new ApiResponse<ResponseAppointmentDTO>(201, "Tạo lịch hẹn thành công.", result.Result.Data)) { StatusCode = 201 };
            return new JsonResult(new ApiResponse<ResponseAppointmentDTO>(400, result.Result.Message)) { StatusCode = 400 };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return new JsonResult(new ApiResponse<ResponseAppointmentDTO>(500, "Đã xảy ra lỗi khi tạo lịch hẹn.")) { StatusCode = 500 };
        }
    }
}
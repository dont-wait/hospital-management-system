using Application.Common.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers.Appointment;
[Route("api/appointments")]
public class AppointmentController : ControllerBase
{


    [HttpPost]
    [Authorize(Roles = "admin, doctor, patient, nurse")]
    public Task<IActionResult> CreateAppointment(RequestAppointmentDTO createAppointmentDto)
    {
        return Task.FromResult<IActionResult>(Ok());
    }

    [HttpGet("available-slots")]
    public Task<IActionResult> GetAvailableAppointments([FromQuery] DateTimeOffset? date,
                                                            [FromQuery] int? departmentId,
                                                            [FromQuery] Guid? doctorId)
    {
        return Task.FromResult<IActionResult>(Ok());
    }
}
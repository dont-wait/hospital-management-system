using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers.Appointment;
[Route("api/appointments")]
public class AppointmentController : ControllerBase
{
    [HttpGet("{id}")]
    public IActionResult GetAppointment(int id)
    {
        return Ok();
    }
}
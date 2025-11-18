using Application.Common.DTOs.Schedule;

namespace Application.Common.DTOs.Appointment;
public class ResponseSearchAvailableAppointmentDTO
{
    public DateOnly? Date { get; set; }
    public int? DepartmentId { get; set; }
    public string? DepartmentName { get; set; }
    public string? DepartmentDescription { get; set; }
    public Guid? DoctorId { get; set; }
    public double PriceOfService { get; set; }
    public List<ResponseDoctorScheduleDTO>? Schedules { get; set; }
}
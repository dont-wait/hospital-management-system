public class ResponseAppointmentDTO
{
    public long Id { get; set; }
    public Guid PatientId { get; set; }
    public DateTimeOffset AppointmentDate { get; set; }
    public Guid DoctorId { get; set; }
    public long DoctorScheduleId { get; set; }
    public int DepartmentId { get; set; }
    public int ServiceId { get; set; }
    public string? AppointmentStatus { get; set; } 
}
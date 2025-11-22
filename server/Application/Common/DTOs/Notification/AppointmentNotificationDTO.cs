public class AppointmentNotificationDTO
{
    public long AppointmentId { get; set; }
    public Guid PatientId { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public string PatientEmail { get; set; } = string.Empty;
    public string DoctorName { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public string RoomName { get; set; } = string.Empty;
    public DateOnly AppointmentDate { get; set; }
    public TimeOnly AppointmentStartTime { get; set; }
    public TimeOnly AppointmentEndTime { get; set; }
    public DateTime AppointmentDateTime { get; set; }    
}
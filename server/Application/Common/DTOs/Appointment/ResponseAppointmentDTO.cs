public class ResponseAppointmentDTO
{
    public long AppointmentId { get; set; } //ma phieu kham
    public long BillingId { get; set; } //ma hoa don
    public string DepartmentName { get; set; } = string.Empty;
    public string RoomName { get; set; } = string.Empty;
    
    public string FullName { get; set; } = string.Empty;
    public DateOnly? DateOfBirth { get; set; } = new DateOnly();
    public string? Gender { get; set; }
    public DateOnly AppointmentDate { get; set; }
    
    public TimeOnly AppointmentStartTime { get; set; }
    public TimeOnly AppointmentEndTime { get; set; }
    public Double PriceOfService { get; set; }
    
    public string AppointmentStatus { get; set; } = string.Empty;
    
    //Phan duoi la thong tin chi tiet ve bac si
    public string DoctorName { get; set; } = string.Empty;
    //....
}
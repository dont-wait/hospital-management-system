public class ResponseAppointmentDTO
{
    public long AppointmentId { get; set; } //ma phieu kham
    public long BillingId { get; set; } //ma hoa don
    public string DepartmentName { get; set; } = string.Empty;
    public string RoomName { get; set; } = string.Empty;
    
    public string FullName { get; set; } = string.Empty;
    public DateOnly DateOfBirth { get; set; } = new DateOnly();
    public string Gender { get; set; } = string.Empty;
    public DateOnly AppointmentDate { get; set; }
    public TimeOnly AppointmentTime { get; set; } = new TimeOnly(); //Gio bat dau slot kham + gio ket thuc slot kham
    public Double PriceOfService { get; set; }
    
    //Phan duoi la thong tin chi tiet ve bac si
    public string DoctorName { get; set; } = string.Empty;
    //....
}
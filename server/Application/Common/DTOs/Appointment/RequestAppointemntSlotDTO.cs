using System.ComponentModel.DataAnnotations;
public class RequestAppointemntSlotDTO
{
    [Required(ErrorMessage = "Ngày hẹn không được để trống")]
    public DateOnly AppointmentDate { get; set; }
    
    [Required(ErrorMessage = "Mã bác sĩ không được để trống")]
    public Guid DoctorId { get; set; }
    
    [Required(ErrorMessage = "Mã chuyên khoa không được để trống")]
    public int DepartmentId { get; set; }
    [Required(ErrorMessage = "Mã khung giờ không được để trống")]
    public long SlotTimeId { get; set; }
}
using System.ComponentModel.DataAnnotations;

public class RequestUpdateAppointmentDTO
{
    [Required(ErrorMessage = "Ngày hẹn không được để trống")]
    public DateTime AppointmentDate { get; set; }
    
    [Required(ErrorMessage = "Mã bác sĩ không được để trống")]
    public Guid DoctorId { get; set; }
    
    [Required(ErrorMessage = "Mã chuyên khoa không được để trống")]
    public int DepartmentId { get; set; }
    
    [Required(ErrorMessage = "Mã lịch làm việc của bác sĩ không được để trống")]
    public long DoctorScheduleId { get; set; }
    
    [Required(ErrorMessage = "Mã dịch vụ không được để trống")]
    public int ServiceId { get; set; }

    public string? AppointmentStatus { get; set; } = AppointmentStatusEnum.CheckIn.ToString();

}
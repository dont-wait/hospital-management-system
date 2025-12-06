using System.ComponentModel.DataAnnotations;

public class RequestAppointmentDTO
{
    [Required(ErrorMessage ="Mã bệnh nhân không được để trống")]
    public Guid PatientId { get; set; }

    [Required(ErrorMessage = "Danh sách cuộc hẹn không được để trống")]
    [MinLength(1, ErrorMessage = "Phải có ít nhất một cuộc hẹn")]
    public List<RequestAppointemntSlotDTO> AppointmentSlots { get; set; }
}
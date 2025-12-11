using System.ComponentModel.DataAnnotations;

public class RequestAppointmentDTO
{
    [Required(ErrorMessage ="Mã bệnh nhân không được để trống")]
    public Guid PatientId { get; set; }

    [MinLength(1, ErrorMessage = "Phải có ít nhất một cuộc hẹn")]
    [Required(ErrorMessage = "Danh sách cuộc hẹn không được để trống")]
    public required List<RequestAppointemntSlotDTO> AppointmentSlots { get; set; }
}
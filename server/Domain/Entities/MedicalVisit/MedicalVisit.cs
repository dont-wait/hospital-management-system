using System.ComponentModel.DataAnnotations;

public class MedicalVisit : BaseEntity
{
    [Key]
    public long Id { get; set; }

    [Required(ErrorMessage = "Triệu chứng (Symptoms) không được để trống.")]
    public string Symptoms { get; set; } = string.Empty;

    [Required(ErrorMessage = "Kết quả khám lâm sàng (PhysicalExamination) không được để trống.")]
    public string PhysicalExamination { get; set; } = string.Empty;

    [Required(ErrorMessage = "Chẩn đoán (Diagnosis) không được để trống.")]
    public string Diagnosis { get; set; } = string.Empty;

    [Required(ErrorMessage = "Phương án điều trị (Treatment) không được để trống.")]
    public string Treatment { get; set; } = string.Empty;

    public string Note { get; set; } = string.Empty;

    public string ImageResult { get; set; } = string.Empty;

    [Required(ErrorMessage = "Lịch hẹn (AppointmentId) là bắt buộc.")]
    public long AppointmentId { get; set; }

    public virtual Appointment? Appointment { get; set; }
}
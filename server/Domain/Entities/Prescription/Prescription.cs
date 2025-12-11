using System.ComponentModel.DataAnnotations;

public class Prescription : BaseEntity
{
    [Key]
    public long Id { get; set; }

    [Required(ErrorMessage = "Hướng dẫn sử dụng thuốc (Instructions) không được để trống.")]
    public string Instructions { get; set; } = string.Empty;

    public string? Note { get; set; } = string.Empty;

    [Required(ErrorMessage = "Thông tin lần khám (MedicalVisit) là bắt buộc.")]
    public virtual MedicalVisit MedicalVisit { get; set; } = null!;

    public ICollection<PrescriptionDetail> PrescriptionDetails { get; set; } =
        new List<PrescriptionDetail>();
}

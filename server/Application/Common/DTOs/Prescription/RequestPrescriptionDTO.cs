using System.ComponentModel.DataAnnotations;
public class RequestPrescriptionDTO
{
    [Required(ErrorMessage = "Hướng dẫn sử dụng thuốc (Instructions) không được để trống.")]
    public string Instructions { get; set; } = string.Empty;

    [Required(ErrorMessage = "Ghi chú (Note) không được để trống.")]
    public string Note { get; set; } = string.Empty;

    [Required(ErrorMessage = "Thông tin lần khám (MedicalVisit) là bắt buộc.")]
    public long MedicalVisitId { get; set; }

    public List<RequestPrescriptionDetailDTO> PrescriptionDetails { get; set; } = new List<RequestPrescriptionDetailDTO>();
}
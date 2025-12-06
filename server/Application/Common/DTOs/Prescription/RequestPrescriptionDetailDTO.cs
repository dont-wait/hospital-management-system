using System.ComponentModel.DataAnnotations;
public class RequestPrescriptionDetailDTO
{
    [Required(ErrorMessage = "Liều dùng (Dosage) không được để trống.")]
    public long Dosage { get; set; }

    [Required(ErrorMessage = "Tên thuốc là bắt buộc.")]
    public string MedicationName { get; set; } = null!;
    
    [Required(ErrorMessage = "Tần suất dùng thuốc (Frequency) không được để trống.")]
    public int Frequency { get; set; }

    [Required(ErrorMessage = "Thời gian điều trị (Duration) không được để trống.")]
    public int Duration { get; set; }

    [Required(ErrorMessage = "Đường dùng thuốc (Route) là bắt buộc.")]
    public string Route { get; set; } = null!;

    [Required(ErrorMessage = "Số lượng thuốc (Quantity) không được để trống.")]
    public int Quantity { get; set; }
}
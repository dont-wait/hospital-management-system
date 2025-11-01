using System.ComponentModel.DataAnnotations;

public class RequestUpdateDoctorDTO
{
[Required]
    [MaxLength(30)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string LastName { get; set; } = string.Empty;

    public DateTime DateOfBirth { get; set; }

    [MaxLength(1)]
    public string Gender { get; set; } = string.Empty;

    [StringLength(10, MinimumLength = 10, ErrorMessage = "Số điện thoại phải đúng 10 chữ số.")]
    public string PhoneNumber { get; set; } = string.Empty;

    public DateTime HireDate { get; set; }

    [StringLength(10, MinimumLength = 10, ErrorMessage = "Số chứng chỉ hành nghề phải đúng 10 ký tự.")]
    public string CertificateNumber { get; set; } = string.Empty;

    [StringLength(100)]
    public string Specialization { get; set; } = string.Empty;

    public string AvatarUrl { get; set; } = string.Empty;
}
using System.ComponentModel.DataAnnotations;
using HospitalManagementSystem.DTOs.UserAccount;

namespace HospitalManagementSystem.DTOs.Employee;

public class RequestEmployeeDTO : RequestUserDTO
{
    [Required]
    [MaxLength(30)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    public DateTime DateOfBirth { get; set; }

    [Required]
    [MaxLength(1)]
    public string Gender { get; set; } = string.Empty;

    [Required]
    [StringLength(10, MinimumLength = 10, ErrorMessage = "Số điện thoại phải đúng 10 chữ số.")]
    public string PhoneNumber { get; set; } = string.Empty;

    [MaxLength(100)]
    [EmailAddress(ErrorMessage = "Email không hợp lệ.")]
    public string Email { get; set; } = string.Empty;

    [Required]
    public DateTime HireDate { get; set; }

    [Required]
    [StringLength(10, MinimumLength = 10, ErrorMessage = "Số chứng chỉ hành nghề phải đúng 10 ký tự.")]
    public string CertificateNumber { get; set; } = string.Empty;
}
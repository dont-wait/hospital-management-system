using System.ComponentModel.DataAnnotations;

namespace HospitalManagementSystem.DTOs.Login;
public class RequestLoginDTO
{
    [Required]
    [StringLength(10, MinimumLength = 10, ErrorMessage = "CCCD không hợp lệ.")]
    public string CitizenID { get; set; } = null!;

    [Required]
    [StringLength(30, MinimumLength = 6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự.")]
    public string Password { get; set; } = null!;
}
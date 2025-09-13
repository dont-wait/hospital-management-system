using System.ComponentModel.DataAnnotations;

namespace HospitalManagementSystem.DTOs.UserAccount
{
    public class RequestUserDTO
    {
        [Required]
        [MaxLength(150)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [StringLength(30, MinimumLength = 6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự.")]
        public string Password { get; set; } = null!;

        [Required]
        [StringLength(30, MinimumLength = 6, ErrorMessage = "Xác nhận mật khẩu phải có ít nhất 6 ký tự.")]
        public string ConfirmPassword { get; set; } = null!;
    }
}
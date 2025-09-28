using System.ComponentModel.DataAnnotations;

namespace HospitalManagementSystem.DTOs.UserAccount
{
    public class RequestUserDTO
    {
        [Required]
        [MinLength(10, ErrorMessage = "CCCD phải có ít nhất 10 ký tự.")]
        [MaxLength(10, ErrorMessage = "CCCD không được vượt quá 10 ký tự.")]
        public string CitizenID { get; set; } = string.Empty;

        [Required]
        [RegularExpression(
            @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$",
            ErrorMessage = "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.")]
        public string Password { get; set; } = null!;

        [Required]
        [StringLength(30, MinimumLength = 6, ErrorMessage = "Xác nhận mật khẩu phải có ít nhất 6 ký tự.")]
        public string ConfirmPassword { get; set; } = null!;
    }
}
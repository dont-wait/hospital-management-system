using System.ComponentModel.DataAnnotations;

public class RequestLoginDTO
{
    [Required]
    [StringLength(12, MinimumLength = 12, ErrorMessage = "CCCD không hợp lệ.")]
    public string CitizenID { get; set; } = null!;

    [Required]
    [StringLength(30, MinimumLength = 8, ErrorMessage = "Mật khẩu phải có ít nhất 8 ký tự.")]
    public string Password { get; set; } = null!;
}
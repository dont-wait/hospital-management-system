using System.ComponentModel.DataAnnotations;

public class RequestVerifyOtp
{
    [Required]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;
    [Required]
    [StringLength(6, ErrorMessage = "Độ dài OTP phải là 6 kí tự")]
    public string Otp { get; set; } = string.Empty;
}
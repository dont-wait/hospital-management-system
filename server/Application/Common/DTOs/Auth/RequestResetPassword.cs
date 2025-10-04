using System.ComponentModel.DataAnnotations;

public class RequestResetPassword
{
    [Required]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;
}
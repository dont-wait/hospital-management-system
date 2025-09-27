using System.ComponentModel.DataAnnotations;

public class RequestResetPassword
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
}
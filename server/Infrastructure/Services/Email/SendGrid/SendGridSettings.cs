namespace Infrastructure.Services.Email.SendGrid;
public class SendGridSettings
{
    public string? ApiKey { get; set; }
    public string? SenderEmail { get; set; }
    public string? SenderName { get; set; }
}
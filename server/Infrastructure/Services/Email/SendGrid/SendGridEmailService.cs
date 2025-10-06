using Infrastructure.Services.Email.SendGrid;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace Infrastructure.Services.Email.SendGrid;
public class SendGridEmailService : IEmailService
{
    private readonly SendGridSettings _settings;

    public SendGridEmailService(IOptions<SendGridSettings> options)
    {
        _settings = options.Value;
    }

    public async Task SendEmailAsync(string to, string subject, string body, bool isHtml = true)
    {
        var client = new SendGridClient(_settings.ApiKey);
        var from = new EmailAddress(_settings.SenderEmail, _settings.SenderName);
        var toEmail = new EmailAddress(to);

        var msg = MailHelper.CreateSingleEmail(
            from,
            toEmail,
            subject,
            isHtml ? null : body,
            isHtml ? body : null
        );

        var response = await client.SendEmailAsync(msg);
        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"Gửi mail từ SendGrid thất bại: {response.StatusCode}");
        }
    }
}
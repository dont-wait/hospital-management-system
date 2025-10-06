using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;

namespace Infrastructure.Services.Email.Smtp;
public class SmtpEmailService : IEmailService
{
    private readonly SmtpSettings _settings;

    public SmtpEmailService(IOptions<SmtpSettings> options)
    {
        _settings = options.Value;
    }

    public async Task SendEmailAsync(string to, string subject, string body, bool isHtml = true)
    {
        var smtpHost = _settings.Host;
        var smtpPort = _settings.Port;
        if (smtpPort <= 0)
        {
            throw new Exception("Thông tin cấu hình cổng SMTP không hợp lệ.");
        }

        var smtpUser = _settings.Username;
        var smtpPass = _settings.Password;
        var fromAddress = _settings.From;

        if (string.IsNullOrWhiteSpace(fromAddress))
        {
            throw new Exception("'From' chưa được cấu hình.");
        }

        using (var client = new SmtpClient(smtpHost, smtpPort))
        {
            client.Credentials = new NetworkCredential(smtpUser, smtpPass);
            client.EnableSsl = true;

            var mailMessage = new MailMessage
            {
                From = new MailAddress(fromAddress, "Medicare Hospital Support"),
                Subject = subject,
                Body = body,
                IsBodyHtml = isHtml,
            };
            mailMessage.To.Add(to);

            try
            {
                await client.SendMailAsync(mailMessage);
            }
            catch (Exception ex)
            {
                throw new Exception($"Gửi mail từ SMTP thất bại: {ex.Message}");
            }
        }
    }
}
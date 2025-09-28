using System.Net;
using System.Net.Mail;
using server.Services;

public class SmtpEmailProvider : IEmailProvider
{
    private readonly IConfiguration _config;

    public SmtpEmailProvider(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendEmailAsync(string to, string subject, string body, bool isHtml = true)
    {
        var smtpHost = _config["EmailSettings:Smtp:Host"];
        var smtpPortValue = _config["EmailSettings:Smtp:Port"];
        if (!int.TryParse(smtpPortValue, out var smtpPort))
        {
            throw new Exception("Invalid or missing SMTP port configuration.");
        }
        var smtpUser = _config["EmailSettings:Smtp:Username"];
        var smtpPass = _config["EmailSettings:Smtp:Password"];
        var fromAddress = _config["EmailSettings:Smtp:From"];
        if (string.IsNullOrWhiteSpace(fromAddress))
        {
            throw new Exception("SMTP 'From' address is not configured.");
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
using server.Services;
using SendGrid;
using SendGrid.Helpers.Mail;
public class SendGridEmailProvider : IEmailProvider
{
    private readonly IConfiguration _config;

    public SendGridEmailProvider(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendEmailAsync(string to, string subject, string body, bool isHtml = true)
    {
        var client = new SendGridClient(_config["SendGrid:ApiKey"]);
        var from = new EmailAddress(_config["SendGrid:SenderEmail"], _config["SendGrid:SenderName"]);
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
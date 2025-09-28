
namespace server.Services;

public interface IEmailProvider
{
    Task SendEmailAsync(string to, string subject, string body, bool isHtml = true);
}

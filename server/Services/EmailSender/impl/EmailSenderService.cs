using server.Services;

public class EmailSenderService : IEmailSenderService
{

    private readonly IEmailProvider _emailProvider;
    private readonly IWebHostEnvironment _env;


    public EmailSenderService(IEmailProvider emailProvider, IWebHostEnvironment env)
    {
        _emailProvider = emailProvider;
        _env = env;
    }

    public async Task SendOtpEmailAsync(string to, string otp)
    {
        var path = Path.Combine(_env.ContentRootPath, "Common", "EmailTemplates", "OtpTemplate.html");       
        string template = File.ReadAllText(path);
        string body = template.Replace("{{OTP}}", otp);

        await _emailProvider.SendEmailAsync(to, "Mã OTP xác thực", body, true);
    }

    public async Task SendResetPasswordEmailAsync(string to, string resetLink)
    {
        var path = Path.Combine(_env.ContentRootPath, "Common", "EmailTemplates", "ResetPasswordTemplate.html");
        string template = File.ReadAllText(path);
        string body = template.Replace("{{RESET_LINK}}", resetLink);

        await _emailProvider.SendEmailAsync(to, "Đặt lại mật khẩu", body, true);
    }

   
}
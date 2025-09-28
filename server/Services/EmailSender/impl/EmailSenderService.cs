using server.Services;


public class EmailSenderService : IEmailSenderService
{

    private readonly IEmailProvider _emailProvider;
    private readonly IWebHostEnvironment _env;
    private readonly string _otpTemplate;

    public EmailSenderService(IEmailProvider emailProvider, IWebHostEnvironment env)
    {
        _emailProvider = emailProvider;
        _env = env;
        var otpTemplatePath = Path.Combine(_env.ContentRootPath, "Common", "EmailTemplates", "OtpTemplate.html");
        _otpTemplate = File.ReadAllText(otpTemplatePath);
    }

    public async Task SendOtpEmailAsync(string to, string otp)
    {
        string body = _otpTemplate.Replace("{{OTP}}", otp);
        await _emailProvider.SendEmailAsync(to, "Mã OTP xác thực", body, true);
    }
}
using Microsoft.AspNetCore.Hosting;


namespace Infrastructure.Services.Email;
public class SendOTPService : IOTPService
{

    private readonly IEmailService _emailProvider;
    private readonly IWebHostEnvironment _env;
    private readonly string _otpTemplate;

    public SendOTPService(IEmailService emailProvider, IWebHostEnvironment env)
    {
        _emailProvider = emailProvider;
        _env = env;
        var otpTemplatePath = Path.Combine(_env.ContentRootPath, "Resources", "EmailTemplates", "OtpTemplate.html");
        _otpTemplate = File.ReadAllText(otpTemplatePath);
    }

    public async Task SendOtpEmailAsync(string to, string otp)
    {
        // Template is loaded in constructor, use cached value
        string body = _otpTemplate.Replace("{{OTP}}", otp);
        await _emailProvider.SendEmailAsync(to, "Mã OTP xác thực", body, true);
    }
}
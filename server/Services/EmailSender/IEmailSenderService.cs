public interface IEmailSenderService
{
    Task SendOtpEmailAsync(string to, string otp);
}
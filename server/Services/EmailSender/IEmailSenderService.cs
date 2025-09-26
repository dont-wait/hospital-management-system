public interface IEmailSenderService
{
    Task SendOtpEmailAsync(string to, string otp);
    Task SendResetPasswordEmailAsync(string to, string resetLink);
}
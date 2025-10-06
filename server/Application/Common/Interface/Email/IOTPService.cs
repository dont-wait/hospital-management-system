public interface IOTPService
{
    Task SendOtpEmailAsync(string to, string otp);
}
public class ResponseVerifyOtp
{
    public bool IsValid { get; set; }
    public string ResetToken { get; set; } = string.Empty;

    // test cáe
    public string Message { get; set; } = string.Empty; 
}

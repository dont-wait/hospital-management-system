using System.Security.Cryptography;

public static class OtpUtil
{
    //Sinh otp bao gồm 6 chữ số ngẫu nhiên theo tieu chuan bao mat
    public static string GenerateOtp()
    {
        var rng = RandomNumberGenerator.Create();
        var bytes = new byte[4];
        rng.GetBytes(bytes);
        var otp = BitConverter.ToUInt32(bytes, 0) % 1000000;
        return otp.ToString("D6");
    }
}
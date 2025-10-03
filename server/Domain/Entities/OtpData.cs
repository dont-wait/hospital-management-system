namespace server.Models;
public class OtpData
{
    public string Code { get; set; } = string.Empty;
    public int Attempts { get; set; }
}
namespace Domain.Entities;
public class OtpData
{
    public string Code { get; set; } = string.Empty;
    public int Attempts { get; set; }
}
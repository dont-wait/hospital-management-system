using HospitalManagementSystem.DTOs.UserAccount;

public class ResponseLoginDTO : ResponseUserDTO
{
    public string AccessToken { get; set; } = null!;
    public string RefreshToken { get; set; } = null!;
}
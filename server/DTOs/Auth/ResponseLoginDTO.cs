using System.ComponentModel.DataAnnotations;
using HospitalManagementSystem.DTOs.UserAccount;

namespace HospitalManagementSystem.DTOs.Login;

public class ResponseLoginDTO : ResponseUserDTO
{
    public string AccessToken { get; set; } = null!;
    public string RefreshToken { get; set; } = null!;
}
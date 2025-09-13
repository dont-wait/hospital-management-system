using Microsoft.AspNetCore.Mvc;
using HospitalManagementSystem.DTOs.UserAccount;
using HospitalManagementSystem.DTOs.Patient;
using Utils;
using HospitalManagementSystem.Services.Account;

namespace HospitalManagementSystem.Controllers.Auth;
[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly IUserAccountService _userAccountService;

    public AccountController(IUserAccountService userAccountService)
    {
        _userAccountService = userAccountService;
    }
    
    [HttpGet("{userId}")]
    public async Task<ApiResponse<ResponsePatientDTO>> GetUserById(Guid userId)
    {
        try
        {
            var result = await _userAccountService.GetUserAccountByIdAsync(userId);
            if (result.IsSuccess)
                return new ApiResponse<ResponsePatientDTO>(200, "Lấy thông tin tài khoản thành công.", result.Data);
            else
                return new ApiResponse<ResponsePatientDTO>(404, result.Message);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new ApiResponse<ResponsePatientDTO>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.");
        }
    }
}
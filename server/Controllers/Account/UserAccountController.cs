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

    [HttpGet("{patientId}")]
    public async Task<ApiResponse<ResponseUserDTO>> GetUserById(Guid patientId)
    {
        try
        {
            var result = await _userAccountService.GetUserAccountByIdAsync(patientId);
            if (result.IsSuccess)
                return new ApiResponse<ResponseUserDTO>(200, "Lấy thông tin tài khoản thành công.", result.Data);
            else
                return new ApiResponse<ResponseUserDTO>(404, result.Message);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new ApiResponse<ResponseUserDTO>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.");
        }
    }

    //[HttpGet("{employeeId}")] for search info about employee
}
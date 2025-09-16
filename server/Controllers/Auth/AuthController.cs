using Microsoft.AspNetCore.Mvc;
using HospitalManagementSystem.DTOs.Patient;
using Utils;
using HospitalManagementSystem.Services.Account;
using HospitalManagementSystem.DTOs.Login;

namespace HospitalManagementSystem.Controllers.Auth;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IUserAccountService _userAccountService;
    private readonly IAuthService _authService;

    public AuthController(IUserAccountService userAccountService, IAuthService authService)
    {
        _userAccountService = userAccountService;
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<ApiResponse<ResponsePatientDTO>> Register(RequestPatientDTO userDto)
    {
        try
        {
            var result = await _userAccountService.CreateUserAccount_Patient_Async(userDto);
            if (result.IsSuccess)
                return new ApiResponse<ResponsePatientDTO>(201, "Tạo tài khoản thành công.", result.Data!);
            else
                return new ApiResponse<ResponsePatientDTO>(400, result.Message);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new ApiResponse<ResponsePatientDTO>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.");
        }
    }
    
    [HttpPost("login")]
    public async Task<ApiResponse<ResponseLoginDTO>> Login(RequestLoginDTO loginDto)
    {
        try
        {
            var result = await _authService.LoginSync(loginDto);
            if (result.IsSuccess)
                return new ApiResponse<ResponseLoginDTO>(200, "Đăng nhập thành công.", result.Data);
            else
                return new ApiResponse<ResponseLoginDTO>(400, result.Message);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new ApiResponse<ResponseLoginDTO>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.");
        }
    }
}
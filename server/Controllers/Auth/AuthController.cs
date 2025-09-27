using Microsoft.AspNetCore.Mvc;
using HospitalManagementSystem.DTOs.Patient;
using HospitalManagementSystem.DTOs.Employee;
using HospitalManagementSystem.Services.Account;
using HospitalManagementSystem.DTOs.Login;
using Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using server.Services;

namespace HospitalManagementSystem.Controllers.Auth;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IUserAccountService _userAccountService;
    private readonly IEmployeeAccountService _employeeAccountService;
    private readonly IAuthService _authService;

    public AuthController(IUserAccountService userAccountService, IEmployeeAccountService employeeAccountService, IAuthService authService)
    {
        _userAccountService = userAccountService;
        _employeeAccountService = employeeAccountService;
        _authService = authService;
    }

    [HttpPost("/patient/register")]
    public async Task<ApiResponse<ResponsePatientDTO>> PatientRegister(RequestPatientDTO userDto)
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

    [HttpPost("/doctor/register")]
    [Authorize(Roles = "admin")]
    public async Task<ApiResponse<ResponseDoctorDTO>> DoctorRegister(RequestDoctorDTO userDto)
    {
        try
        {
            var result = await _employeeAccountService.CreateDoctorAsync(userDto);
            if (result.IsSuccess)
                return new ApiResponse<ResponseDoctorDTO>(201, "Tạo tài khoản thành công.", result.Data);
            else
                return new ApiResponse<ResponseDoctorDTO>(400, result.Message);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new ApiResponse<ResponseDoctorDTO>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.");
        }
    }

    [HttpPost("/login")]
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

    [HttpPost("/logout")]
    public ApiResponse<string> Logout()
    {
        try
        {
            var result = _authService.LogoutAsync();
            if (result.IsSuccess)
                return new ApiResponse<string>(200, result.Data!);
            else
                return new ApiResponse<string>(400, result.Message);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Lỗi khi đăng xuất: {ex.Message}");
            return new ApiResponse<string>(500, "Đã xảy ra lỗi trong quá trình đăng xuất.");
        }
    }


    /*
    1.Để có thể reset password, người dùng cần nhập email đã đăng ký tạo tài khoản
    2.Hệ thống lúc này sẽ gửi mã otp về email đó để xác thực - trong bước này ta cần lưu mã otp vào db
        NGười dùng được phép nhập sai tối đa 3 lần, nếu sai quá 3 lần thì mã otp sẽ bị vô hiệu hóa
        Mã otp chỉ có hiệu lực trong vòng 5 phút kể từ khi gửi
    3.Sau khi xác thực thành công, người dùng sẽ được phép đặt lại mật khẩu mới
    */

    //1 Người dùng gửi request yêu cầu đổi mật khẩu
    [HttpPost("/request-reset")]
    public async Task<ApiResponse<ResponseResetPassword>> RequestResetPassword(RequestResetPassword request)
    {
        try
        {
            var result = await _authService.RequestPasswordResetAsync(request);
            if (result.IsSuccess)
                return new ApiResponse<ResponseResetPassword>(200, "Success", result.Data);
            else
                return new ApiResponse<ResponseResetPassword>(400, result.Message);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new ApiResponse<ResponseResetPassword>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.");
        }
    }

    //2. Sau khi nhận được request server sẽ lưu otp dưới redis
    //Người dùng cần thực hiện check email và nhập lại, nếu sau quá 3 lần thì
    //lặp túc otp invalid
    [HttpPost("/verify-otp")]
    public async Task<ApiResponse<ResponseVerifyOtp>> VerifyOtp(RequestVerifyOtp request)
    {
        try
        {
            var result = await _authService.VerifyOtpAsync(request);

            if (result.Data != null && result.Data.IsValid)
                return new ApiResponse<ResponseVerifyOtp>(200, "Xác thực OTP thành công.", result.Data);
            else
                return new ApiResponse<ResponseVerifyOtp>(400, result.Message);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new ApiResponse<ResponseVerifyOtp>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.");
        }
    }

    // //3. Người dùng gửi request đặt lại mật khẩu mới
    // [HttpPost("/reset-password")]
    // public async Task<ApiResponse<ResponseResetPassword>> ResetPassword(RequestResetPasswordFinal request)
    // {
    //     try
    //     {
    //         var result = await _authService.ResetPasswordAsync(request);
    //         if (result.IsSuccess)
    //             return new ApiResponse<ResponseResetPassword>(200, "Đặt lại mật khẩu thành công.", result.Data);
    //         else
    //             return new ApiResponse<ResponseResetPassword>(400, result.Message);
    //     }
    //     catch (Exception ex)
    //     {
    //         Console.WriteLine(ex);
    //         return new ApiResponse<ResponseResetPassword>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.");
    //     }
    // }
}
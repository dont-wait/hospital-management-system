using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Application.Services.Auth;
using Application.Common.Utils;

namespace WebApi.Controllers.Auth;
[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IUserAccountService _userAccountService;
    private readonly IEmployeeAccountService _employeeAccountService;
    private readonly IAuthService _authService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AuthController(IUserAccountService userAccountService, IEmployeeAccountService employeeAccountService, IAuthService authService, IHttpContextAccessor httpContextAccessor)
    {
        _userAccountService = userAccountService;
        _employeeAccountService = employeeAccountService;
        _authService = authService;
        _httpContextAccessor = httpContextAccessor;
    }

    [HttpPost("patient/register")]
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

    [HttpPost("doctor/register")]
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

    [HttpPost("login")]
    public async Task<ApiResponse<ResponseLoginDTO>> Login(RequestLoginDTO loginDto)
    {
        try
        {
            var result = await _authService.LoginSync(loginDto);
            if (result.IsSuccess) {
                var accessTokenOption = new CookieOptions
                {
                    HttpOnly = true,
                    Expires = DateTime.UtcNow.AddMinutes(15),
                    SameSite = SameSiteMode.None,
                    Secure = true,
                    Path = "/"
                };

                var refreshTokenOption = new CookieOptions
                {
                    HttpOnly = true,
                    Expires = DateTime.UtcNow.AddDays(7),
                    SameSite = SameSiteMode.None,
                    Secure = true,
                    Path = "/"
                };

                _httpContextAccessor.HttpContext?.Response.Cookies.Append("accessToken", result.Data!.AccessToken, accessTokenOption);
                _httpContextAccessor.HttpContext?.Response.Cookies.Append("refreshToken", result.Data!.RefreshToken, refreshTokenOption);

                return new ApiResponse<ResponseLoginDTO>(200, "Đăng nhập thành công.", result.Data);
            }
            return new ApiResponse<ResponseLoginDTO>(400, result.Message);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new ApiResponse<ResponseLoginDTO>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.");
        }
    }

    [HttpPost("logout")]
    public ApiResponse<string> Logout()
    {
        try
        {
            _httpContextAccessor.HttpContext?.Response.Cookies.Delete("accessToken");
            _httpContextAccessor.HttpContext?.Response.Cookies.Delete("refreshToken");

            return new ApiResponse<string>(200, "Đăng xuất thành công.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Lỗi khi đăng xuất: {ex.Message}");
            return new ApiResponse<string>(500, "Đã xảy ra lỗi trong quá trình đăng xuất.");
        }
    }

    //1 Người dùng gửi request yêu cầu đổi mật khẩu
    [HttpPost("request-reset")]
    public async Task<ApiResponse<string>> RequestResetPassword(RequestResetPassword request)
    {
        try
        {
            var result = await _authService.RequestPasswordResetAsync(request);
            if (result.IsSuccess)
                return new ApiResponse<string>(200, "Vui lòng kiểm tra email để nhập mã otp");
            else
                return new ApiResponse<string>(400, result.Message);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new ApiResponse<string>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.");
        }
    }

    //2. Sau khi nhận được request server sẽ lưu otp dưới redis
    //Người dùng cần thực hiện check email và nhập lại, nếu sau quá 3 lần thì
    //lặp túc otp invalid
    [HttpPost("verify-otp")]
    public async Task<IActionResult> VerifyOtp(RequestVerifyOtp request)
    {
        try
        {
            var result = await _authService.VerifyOtpAsync(request);

            if (result.IsSuccess && result.Data != null && result.Data.IsValid) {
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Expires = DateTime.UtcNow.AddDays(7),
                    SameSite = SameSiteMode.None,
                    Secure = true
                }; 

                _httpContextAccessor.HttpContext?.Response.Cookies.Append("resetToken", result.Data.ResetToken!, cookieOptions);

                return Ok(new ApiResponse<ResponseVerifyOtp>(200, "Xác thực OTP thành công.", result.Data));
            }
            else
                return BadRequest(new ApiResponse<ResponseVerifyOtp>(400, result.Message));

        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return BadRequest(new ApiResponse<ResponseVerifyOtp>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu."));
        }
    }

    // //3. Người dùng gửi request đặt lại mật khẩu mới
    [HttpPost("reset-password")]
    public async Task<ApiResponse<string>> ResetPassword(RequestResetPasswordFinal request)
    {
        try
        {
            var resetToken = _httpContextAccessor.HttpContext?.Request.Cookies["resetToken"];

            var result = await _authService.ResetPasswordAsync(request, resetToken!);
            if (result.IsSuccess) {
                _httpContextAccessor.HttpContext?.Response.Cookies.Delete("resetToken");
                return new ApiResponse<string>(200, "Success", result.Data);
            }
            else
                return new ApiResponse<string>(400, result.Message);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new ApiResponse<string>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.");
        }
    }
}
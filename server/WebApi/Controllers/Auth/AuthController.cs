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
    public async Task<IActionResult> PatientRegister(RequestPatientDTO userDto)
    {
        try
        {
            var result = await _userAccountService.CreateUserAccount_Patient_Async(userDto);
            if (result.IsSuccess)
                return new JsonResult(new ApiResponse<ResponsePatientDTO>(201, "Tạo tài khoản thành công.", result.Data!)) { StatusCode = 201 };
            else
                return new JsonResult(new ApiResponse<ResponsePatientDTO>(400, result.Message)) { StatusCode = 400 };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new JsonResult(new ApiResponse<ResponsePatientDTO>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.")) { StatusCode = 500 };
        }
    }

    [HttpPost("doctor/register")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> DoctorRegister(RequestDoctorDTO userDto, [FromQuery] bool hod = false)
    {
        try
        {
            var result = await _employeeAccountService.CreateDoctorAsync(userDto, hod);
            if (result.IsSuccess)
                return new JsonResult(new ApiResponse<ResponseDoctorDTO>(201, "Tạo tài khoản thành công.", result.Data)) { StatusCode = 201 };
            else
                return new JsonResult(new ApiResponse<ResponseDoctorDTO>(400, result.Message)) { StatusCode = 400 };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new JsonResult(new ApiResponse<ResponseDoctorDTO>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.")) { StatusCode = 500 };
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(RequestLoginDTO loginDto)
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
                    Path = "/",
                    // Don't set Domain for cross-origin cookies to work
                };

                var refreshTokenOption = new CookieOptions
                {
                    HttpOnly = true,
                    Expires = DateTime.UtcNow.AddDays(7),
                    SameSite = SameSiteMode.None,
                    Secure = true,
                    Path = "/",
                    // Don't set Domain for cross-origin cookies to work
                };

                _httpContextAccessor.HttpContext?.Response.Cookies.Append("accessToken", result.Data!.AccessToken, accessTokenOption);
                _httpContextAccessor.HttpContext?.Response.Cookies.Append("refreshToken", result.Data!.RefreshToken, refreshTokenOption);

                return new JsonResult(new ApiResponse<ResponseLoginDTO>(200, "Đăng nhập thành công.", result.Data)) { StatusCode = 200 };
            }
            return new JsonResult(new ApiResponse<ResponseLoginDTO>(400, result.Message)) { StatusCode = 400 };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new JsonResult(new ApiResponse<ResponseLoginDTO>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.")) { StatusCode = 500 };
        }
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        try
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.None,
                Secure = true,
                Path = "/",
                Expires = DateTime.UtcNow.AddDays(-1)
            };

            _httpContextAccessor.HttpContext?.Response.Cookies.Delete("accessToken", cookieOptions);
            _httpContextAccessor.HttpContext?.Response.Cookies.Delete("refreshToken", cookieOptions);

            return new JsonResult(new ApiResponse<string>(200, "Đăng xuất thành công.")) { StatusCode = 200 };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Lỗi khi đăng xuất: {ex.Message}");
            return new JsonResult(new ApiResponse<string>(500, "Đã xảy ra lỗi trong quá trình đăng xuất.")) { StatusCode = 500 };
        }
    }

    //1 Người dùng gửi request yêu cầu đổi mật khẩu
    [HttpPost("request-reset")]
    public async Task<IActionResult> RequestResetPassword(RequestResetPassword request)
    {
        try
        {
            var result = await _authService.RequestPasswordResetAsync(request);
            if (result.IsSuccess)
                return new JsonResult(new ApiResponse<string>(200, "Vui lòng kiểm tra email để nhập mã otp")) { StatusCode = 200 };
            else
                return new JsonResult(new ApiResponse<string>(400, result.Message)) { StatusCode = 400 };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new JsonResult(new ApiResponse<string>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.")) { StatusCode = 500 };
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
                    Expires = DateTime.UtcNow.AddMinutes(10),
                    SameSite = SameSiteMode.None,
                    Secure = true,
                    Path = "/",
                    // Don't set Domain for cross-origin cookies to work
                }; 

                _httpContextAccessor.HttpContext?.Response.Cookies.Append("resetToken", result.Data.ResetToken!, cookieOptions);

                return new JsonResult(new ApiResponse<ResponseVerifyOtp>(200, "Xác thực OTP thành công.", result.Data)) { StatusCode = 200 };
            }
            else
                return new JsonResult(new ApiResponse<ResponseVerifyOtp>(400, result.Message)) { StatusCode = 400 };

        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return BadRequest(new ApiResponse<ResponseVerifyOtp>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu."));
        }
    }

    // //3. Người dùng gửi request đặt lại mật khẩu mới
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(RequestResetPasswordFinal request)
    {
        try
        {
            var resetToken = _httpContextAccessor.HttpContext?.Request.Cookies["resetToken"];

            var result = await _authService.ResetPasswordAsync(request, resetToken!);
            if (result.IsSuccess) {
                _httpContextAccessor.HttpContext?.Response.Cookies.Delete("resetToken");
                return new JsonResult(new ApiResponse<string>(200, "Success", result.Data)) { StatusCode = 200 };
            }
            else
                return new JsonResult(new ApiResponse<string>(400, result.Message)) { StatusCode = 400 };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new JsonResult(new ApiResponse<string>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.")) { StatusCode = 500 };
        }
    }
}
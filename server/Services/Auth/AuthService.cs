using HospitalManagementSystem.DTOs.Login;
using HospitalManagementSystem.DTOs.Employee;
using HospitalManagementSystem.Repositories.Account;
using HospitalManagementSystem.DTOs.Patient;
using Utils;
using System.Net.Mime;
using server.Models;

namespace HospitalManagementSystem.Services.Account;

public interface IAuthService
{
    Task<ServiceResult<ResponseLoginDTO?>> LoginSync(RequestLoginDTO loginDto);
    ServiceResult<string> LogoutAsync();

    Task<ServiceResult<ResponseResetPassword>> RequestPasswordResetAsync(RequestResetPassword request);
    Task<ServiceResult<ResponseVerifyOtp>> VerifyOtpAsync(RequestVerifyOtp request);
}

public class AuthService : IAuthService
{
    private readonly IUserAccountRepository _userAccountRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IRedisService _redisService;

    public AuthService(IUserAccountRepository userAccountRepository, IHttpContextAccessor httpContextAccessor, IRedisService redisService)
    {
        _userAccountRepository = userAccountRepository;
        _httpContextAccessor = httpContextAccessor;
        _redisService = redisService;
    }

    public async Task<ServiceResult<ResponseLoginDTO?>> LoginSync(RequestLoginDTO loginDto)
    {
        var userAccountExists = await _userAccountRepository.GetUserAccountByCitizenIDAsync(loginDto.CitizenID);

        if (userAccountExists == null)
            return ServiceResult<ResponseLoginDTO?>.Fail("Sai CCCD hoặc mật khẩu.");

        bool isPasswordValid = HashPasswordUtil.VerifyPassword(loginDto.Password, userAccountExists.Password);
        if (!isPasswordValid)
            return ServiceResult<ResponseLoginDTO?>.Fail("Sai CCCD hoặc mật khẩu.");

        ResponseEmployeeDTO? responseEmployeeDTO = null;
        if (userAccountExists.Employee != null)
            responseEmployeeDTO = new ResponseEmployeeDTO
            {
                EmployeeId = userAccountExists.Employee.Id,
                FirstName = userAccountExists.Employee.FirstName,
                LastName = userAccountExists.Employee.LastName,
                PhoneNumber = userAccountExists.Employee.PhoneNumber,
                Email = userAccountExists.Employee.Email,
                CertificateNumber = userAccountExists.Employee.CertificateNumber,
                DateOfBirth = userAccountExists.Employee.DateOfBirth,
                Gender = userAccountExists.Employee.Gender,
                HireDate = userAccountExists.Employee.HireDate,
                Specialization = userAccountExists.Employee.Doctor.Specialization,
                RoleId = userAccountExists.Employee.RoleId,
            };

        ResponseLoginDTO responseLoginDTO = new ResponseLoginDTO
        {
            UserAccountId = userAccountExists.Id,
            CitizenID = userAccountExists.CitizenID,
            AvatarUrl = userAccountExists.AvatarUrl,
            Is_Active = userAccountExists.Is_Active,
            Patient = userAccountExists.Patient != null ? new ResponsePatientDTO
            {
                PatientId = userAccountExists.Patient.Id,
                FirstName = userAccountExists.Patient.FirstName,
                LastName = userAccountExists.Patient.LastName,
                PhoneNumber = userAccountExists.Patient.PhoneNumber,
                Email = userAccountExists.Patient.Email,
            } : null,
            Employee = userAccountExists.Employee != null ? responseEmployeeDTO : null
        };

        string accessToken = GenerateTokenUtil.GenerateAccessToken(
            userAccountExists.Employee?.Id.ToString() ?? userAccountExists.Patient?.Id.ToString()!,
            userAccountExists.CitizenID,
            responseEmployeeDTO?.RoleId.ToString() ?? "patient",
            ProgramGlobals.JwtSettingsInstance
        );

        string refreshToken = GenerateTokenUtil.GenerateRefreshToken();

        responseLoginDTO.AccessToken = accessToken;
        responseLoginDTO.RefreshToken = refreshToken;

        var CookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = DateTime.UtcNow.AddDays(7),
            SameSite = SameSiteMode.None,
            Secure = true
        };

        try
        {
            _httpContextAccessor.HttpContext?.Response.Cookies.Append("accessToken", accessToken, CookieOptions);
            _httpContextAccessor.HttpContext?.Response.Cookies.Append("refreshToken", refreshToken, CookieOptions);
        }
        catch (Exception ex)
        {
            return ServiceResult<ResponseLoginDTO?>.Fail($"Lỗi khi setting cookies: {ex.Message}");
        }

        return ServiceResult<ResponseLoginDTO?>.Success(responseLoginDTO);
    }
    
    public ServiceResult<string> LogoutAsync()
    {
        try
        {
            var CookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(-1),
                SameSite = SameSiteMode.None,
                Secure = true
            };
            _httpContextAccessor.HttpContext?.Response.Cookies.Delete("accessToken");
            _httpContextAccessor.HttpContext?.Response.Cookies.Delete("refreshToken");

            return ServiceResult<string>.Success("Đăng xuất thành công.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Lỗi khi xóa cookies: {ex.Message}");
            return ServiceResult<string>.Fail($"Lỗi khi đăng xuất");
        }
    }

    public Task<ServiceResult<ResponseResetPassword>> RequestPasswordResetAsync(RequestResetPassword request)
    {
        string otp = OtpUtil.GenerateOtp();

        //ko check email co ton tai hay ko de tranh lo thong tin
        var otpData = new 
        {
            Otp = otp,
            Attempts = 0
        };

        _redisService.SetAsync($"OTP:{request.Email}", otp, TimeSpan.FromMinutes(3));

        return Task.FromResult(ServiceResult<ResponseResetPassword>.Success(new ResponseResetPassword { Message = "Vui lòng kiểm tra email để nhận mã OTP." }));
    }

    public async Task<ServiceResult<ResponseVerifyOtp>> VerifyOtpAsync(RequestVerifyOtp request)
    {
        var otpInRedis = await _redisService.GetAsync<OtpData>($"{request.Email}");
        //Check otp co ton tai hay ko hoac het han hay chua, nhap sai qua 3 lan la vo hieu hoa otp
        if (otpInRedis == null)
            return ServiceResult<ResponseVerifyOtp>.Fail("Mã OTP không hợp lệ");

        if (otpInRedis.Code != request.Otp)
        {
            otpInRedis.Attempts++;
            if (otpInRedis.Attempts >= 3)
            {
                await _redisService.RemoveAsync($"{request.Email}");
                return ServiceResult<ResponseVerifyOtp>.Fail("Sai OTP quá 3 lần! Vui lòng xin gửi lại OTP");
            }

            //Update attempts            
            await _redisService.UpdateTimeToLiveAsync($"{request.Email}", otpInRedis);
            return ServiceResult<ResponseVerifyOtp>.Fail("Mã OTP không hợp lệ");
        }
        // OTP đúng → tạo reset-token
        string resetToken = Guid.NewGuid().ToString();
        await _redisService.SetAsync($"RESET:{resetToken}", request.Email, TimeSpan.FromMinutes(10));

        // Xoá OTP để không reuse
        await _redisService.RemoveAsync($"OTP:{request.Email}");

        return ServiceResult<ResponseVerifyOtp>.Success(new ResponseVerifyOtp { IsValid = true, Message = resetToken });
        
    }
}
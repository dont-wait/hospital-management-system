using Application.Common.Utils;
using Domain.Entities;

namespace Application.Services.Auth;
public class AuthService : IAuthService
{
    private readonly IUserAccountRepository _userAccountRepository;
    private readonly IRedisService _redisService;
    private readonly IOTPService _emailSenderService;
    private readonly ITokenService _tokenService;

    public AuthService(IUserAccountRepository userAccountRepository, IRedisService redisService, IOTPService emailSenderService, ITokenService tokenService)
    {
        _userAccountRepository = userAccountRepository;
        _redisService = redisService;
        _emailSenderService = emailSenderService;
        _tokenService = tokenService;
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

        try
            {
            string accessToken = _tokenService.GenerateAccessToken(
                userAccountExists.Employee?.Id.ToString() ?? userAccountExists.Patient?.Id.ToString()!,
                userAccountExists.CitizenID,
                responseEmployeeDTO?.RoleId.ToString() ?? "patient"
            );

            string refreshToken = _tokenService.GenerateRandomToken();

            responseLoginDTO.AccessToken = accessToken;
            responseLoginDTO.RefreshToken = refreshToken;
        }
        catch (Exception ex)
        {
            return ServiceResult<ResponseLoginDTO?>.Fail($"Lỗi khi setting cookies: {ex.Message}");
        }

        return ServiceResult<ResponseLoginDTO?>.Success(responseLoginDTO);
    }

    public async Task<ServiceResult<string>> RequestPasswordResetAsync(RequestResetPassword request)
    {
        string otp = OtpUtil.GenerateOtp();

        //ko check email co ton tai hay ko de tranh lo thong tin
        var otpData = new OtpData()
        {
            Code = otp,
            Attempts = 0
        };
        try
        {
            UserAccount? existingUserAccount = await _userAccountRepository.GetUserAccountByEmailAsync(request.Email);
            //Just email existing, server save otp in redis
            if (existingUserAccount != null)
                await _redisService.SetAsync($"OTP:{request.Email}", otpData, TimeSpan.FromMinutes(3));

            await _emailSenderService.SendOtpEmailAsync(request.Email, otp);

        }
        catch (Exception ex)
        {
            return ServiceResult<string>.Fail($"Đã xảy ra gián đoạn khi gửi email: {ex.Message}");
        }

        return ServiceResult<string>.Success("Vui lòng kiểm tra email để nhận mã OTP.");
    }

    public async Task<ServiceResult<ResponseVerifyOtp>> VerifyOtpAsync(RequestVerifyOtp request)
    {
        var otpInRedis = await _redisService.GetAsync<OtpData>($"OTP:{request.Email}");
        //Check otp co ton tai hay ko hoac het han hay chua, nhap sai qua 3 lan la vo hieu hoa otp
        if (otpInRedis == null)
            return ServiceResult<ResponseVerifyOtp>.Fail("Mã OTP không hợp lệ");

        if (otpInRedis.Code != request.Otp)
        {
            otpInRedis.Attempts++;
            if (otpInRedis.Attempts >= 3)
            {
                await _redisService.RemoveAsync($"OTP:{request.Email}");
                return ServiceResult<ResponseVerifyOtp>.Fail("Sai OTP quá 3 lần! Vui lòng xin gửi lại OTP");
            }

            //Update attempts            
            await _redisService.UpdateTimeToLiveAsync($"OTP:{request.Email}", otpInRedis);
            return ServiceResult<ResponseVerifyOtp>.Fail("Mã OTP không hợp lệ");
        }

        try
        {
            // OTP đúng => tạo reset-token luu vao cookie va redis
            string resetToken = _tokenService.GenerateRandomToken();
            await _redisService.SetAsync($"RESET:{resetToken}", request.Email, TimeSpan.FromMinutes(10));

            // Xoá OTP để không reuse
            await _redisService.RemoveAsync($"OTP:{request.Email}");

            return ServiceResult<ResponseVerifyOtp>.Success(new ResponseVerifyOtp { IsValid = true, ResetToken = resetToken });
        }
        catch (Exception ex)
        {
            return ServiceResult<ResponseVerifyOtp>.Fail($"Lỗi khi setting cookies: {ex.Message}");
        }


    }

    public async Task<ServiceResult<string>> ResetPasswordAsync(RequestResetPasswordFinal request, string resetToken)
    {
        if (string.IsNullOrEmpty(resetToken))
        {
            return ServiceResult<string>.Fail("Reset token không hợp lệ hoặc đã hết hạn");
        }
        //1.check email trong reset token
        var existingEmail = await _redisService.GetAsync($"RESET:{resetToken}");
        if (String.IsNullOrEmpty(existingEmail))
        {
            return ServiceResult<string>.Fail("Reset token không hợp lệ hoặc đã hết hạn");
        }

        //2. Lay user tu db de update password
        //TODO: Xac thuc email truoc r ms dc thuc hien cac tinh nang nay
        UserAccount? existingUserAccount = await _userAccountRepository.GetUserAccountByEmailAsync(existingEmail);
        if (existingUserAccount == null)
        {
            await _redisService.RemoveAsync($"RESET:{resetToken}"); //vo hieu hoa reset token neu email kh ton tai
            return ServiceResult<string>.Fail("Không tìm thấy tài khoản người dùng với email này.");
        }

        //3. hash pass
        existingUserAccount.Password = HashPasswordUtil.HashPassword(request.NewPassword);

        //4. save db
        await _userAccountRepository.UpdateSync(existingUserAccount);

        //5. Xoa reset token
        await _redisService.RemoveAsync($"RESET:{resetToken}");

        //6. Xoa cookie reset token ở layer controller

        //7. Response client
        return ServiceResult<string>.Success("Đặt lại mật khẩu thành công");
    }
}
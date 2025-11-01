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
        var user = await _userAccountRepository.GetUserAccountByCitizenIDAsync(loginDto.CitizenID);
        if (user == null) return ServiceResult<ResponseLoginDTO?>.Fail("Sai CCCD hoặc mật khẩu.");

        bool ok = HashPasswordUtil.VerifyPassword(loginDto.Password, user.Password);
        if (!ok) return ServiceResult<ResponseLoginDTO?>.Fail("Sai CCCD hoặc mật khẩu.");

        // 1. Case: Build Employee DTO
        ResponseEmployeeDTO? employeeDto = null;
        if (user.Employee != null && !string.IsNullOrWhiteSpace(user.Employee.RoleId))
        {
            switch (user.Employee.RoleId)
            {
                case "doctor":
                    employeeDto = new ResponseDoctorDTO
                    {
                        EmployeeId = user.Employee.Id,
                        FirstName = user.Employee.FirstName,
                        LastName = user.Employee.LastName,
                        PhoneNumber = user.Employee.PhoneNumber,
                        Email = user.Employee.Email,
                        CertificateNumber = user.Employee.CertificateNumber,
                        DateOfBirth = user.Employee.DateOfBirth,
                        Gender = user.Employee.Gender,
                        HireDate = user.Employee.HireDate,
                        Specialization = user.Employee.Doctor!.Specialization,
                        RoleId = user.Employee.RoleId
                    };
                    break;

                case "admin":
                    employeeDto = new ResponseAdminDto
                    {
                        EmployeeId = user.Employee.Id,
                        FirstName = user.Employee.FirstName,
                        LastName = user.Employee.LastName,
                        PhoneNumber = user.Employee.PhoneNumber,
                        Email = user.Employee.Email,
                        CertificateNumber = user.Employee.CertificateNumber,
                        Gender = user.Employee.Gender,
                        DateOfBirth = user.Employee.DateOfBirth,
                        RoleId = user.Employee.RoleId
                    };
                    break;

                default:
                    //Role không hợp lệ
                    break;
            }
        }

        // 2. Case: Build Patient DTO (nếu có)
        ResponsePatientDTO? patientDto = null;
        if (user.Patient != null)
        {
            patientDto = new ResponsePatientDTO
            {
                PatientId = user.Patient.Id,
                FirstName = user.Patient.FirstName,
                LastName = user.Patient.LastName,
                PhoneNumber = user.Patient.PhoneNumber,
                Email = user.Patient.Email,
                RoleId = user.Patient.RoleId,
                Gender = user.Patient.Gender,
                DateOfBirth = user.Patient.DateOfBirth,
                Address = user.Patient.Address,
                Nationality = user.Patient.Nationality,
                PlaceOfResidence = user.Patient.PlaceOfResidence
            };
        }

        // 3) Nếu cả hai đều null => không hợp lệ
        if (employeeDto == null && patientDto == null)
            return ServiceResult<ResponseLoginDTO?>.Fail("Tài khoản không hợp lệ.");

        // 4) Tạo token & response
        try
        {
            var subjectId = user.Employee?.Id.ToString() ?? user.Patient?.Id.ToString()!;
            var role = employeeDto?.RoleId ?? patientDto?.RoleId ?? "patient";

            var accessToken = _tokenService.GenerateAccessToken(subjectId, user.CitizenID, role);
            var refreshToken = _tokenService.GenerateRandomToken();

            var resp = new ResponseLoginDTO
            {
                UserAccountId = user.Id,
                CitizenID = user.CitizenID,
                AvatarUrl = user.AvatarUrl,
                Is_Active = user.Is_Active,
                Employee = employeeDto,
                Patient = patientDto,
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };

            return ServiceResult<ResponseLoginDTO?>.Success(resp);
        }
        catch (Exception ex)
        {
            return ServiceResult<ResponseLoginDTO?>.Fail($"Lỗi khi setting cookies: {ex.Message}");
        }
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
using HospitalManagementSystem.DTOs.Login;
using HospitalManagementSystem.DTOs.Employee;
using HospitalManagementSystem.Repositories.Account;
using HospitalManagementSystem.DTOs.Patient;
using Utils;

namespace HospitalManagementSystem.Services.Account;

public interface IAuthService
{
    Task<ServiceResult<ResponseLoginDTO?>> LoginSync(RequestLoginDTO loginDto);
}

public class AuthService : IAuthService
{
    private readonly IUserAccountRepository _userAccountRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AuthService(IUserAccountRepository userAccountRepository, IHttpContextAccessor httpContextAccessor)
    {
        _userAccountRepository = userAccountRepository;
        _httpContextAccessor = httpContextAccessor;
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
            userAccountExists.EmployeeId.ToString() ?? userAccountExists.PatientId.ToString()!,
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
}
using HospitalManagementSystem.DTOs.Login;
using HospitalManagementSystem.DTOs.UserAccount;
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

    public AuthService(IUserAccountRepository userAccountRepository)
    {
        _userAccountRepository = userAccountRepository;
    }

    public async Task<ServiceResult<ResponseLoginDTO?>> LoginSync(RequestLoginDTO loginDto)
    {
        var userAccountExists = await _userAccountRepository.GetUserAccountByCitizenIDAsync(loginDto.CitizenID);

        if (userAccountExists == null)
            return ServiceResult<ResponseLoginDTO?>.Fail("Sai CCCD hoặc mật khẩu.");

        bool isPasswordValid = HashPasswordUtil.VerifyPassword(loginDto.Password, userAccountExists.Password);
        if (!isPasswordValid)
            return ServiceResult<ResponseLoginDTO?>.Fail("Sai CCCD hoặc mật khẩu.");

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
            } : null
        };

        return ServiceResult<ResponseLoginDTO?>.Success(responseLoginDTO);
    }
}
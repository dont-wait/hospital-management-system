using Utils;
using HospitalManagementSystem.DTOs.Patient;
using HospitalManagementSystem.DTOs.UserAccount;
using HospitalManagementSystem.Repositories.Account;
namespace HospitalManagementSystem.Services.Account;

public interface IUserAccountService
{
    Task<ServiceResult<ResponsePatientDTO>> CreateUserAccount_Patient_Async(RequestPatientDTO userDto);
    Task<ServiceResult<ResponseUserDTO?>> GetUserAccountByIdAsync(Guid userId);
}

class UserAccountService : IUserAccountService
{
    private readonly IUserAccountRepository _userAccountRepository;

    public UserAccountService(IUserAccountRepository userAccountRepository)
    {
        _userAccountRepository = userAccountRepository;
    }

    public async Task<ServiceResult<ResponsePatientDTO>> CreateUserAccount_Patient_Async(RequestPatientDTO userDto)
    {
        if (await _userAccountRepository.GetUserAccountByCitizenIDAsync(userDto.CitizenID) != null)
            return ServiceResult<ResponsePatientDTO>.Fail("Số CMND/CCCD đã tồn tại.");

        if (userDto.Password != userDto.ConfirmPassword)
            return ServiceResult<ResponsePatientDTO>.Fail("Mật khẩu và xác nhận mật khẩu không khớp.");

        string hashedPassword = HashPasswordUtil.HashPassword(userDto.Password);
        userDto.Password = hashedPassword;

        Patient patient = await _userAccountRepository.CreateUserAccount_Patient_Async(userDto);
        if (patient == null)
            return ServiceResult<ResponsePatientDTO>.Fail("Tạo tài khoản thất bại.");

        var responsePatientDto = new ResponsePatientDTO
        {
            PatientId = patient.Id,
            FirstName = patient.FirstName,
            LastName = patient.LastName,
            PhoneNumber = patient.PhoneNumber,
            Email = patient.Email,
        };

        return ServiceResult<ResponsePatientDTO>.Success(responsePatientDto);
    }
    
    public async Task<ServiceResult<ResponseUserDTO?>> GetUserAccountByIdAsync(Guid userId)
    {
        var userAccount = await _userAccountRepository.GetUserAccountByIdAsync(userId);
        if (userAccount == null)
            return ServiceResult<ResponseUserDTO?>.Fail("Tài khoản không tồn tại.");

        return ServiceResult<ResponseUserDTO?>.Success(userAccount);
    }
}
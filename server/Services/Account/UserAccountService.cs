using Utils;
using HospitalManagementSystem.DTOs.Patient;
using HospitalManagementSystem.Repositories.Account;
using Azure.Core;

namespace HospitalManagementSystem.Services.Account;

public interface IUserAccountService
{
    Task<ServiceResult<ResponsePatientDTO>> CreateUserAccount_Patient_Async(RequestPatientDTO userDto);
    Task<ServiceResult<ResponsePatientDTO?>> GetUserAccountByIdAsync(Guid userId);
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
        if (userDto.Password != userDto.ConfirmPassword)
            return ServiceResult<ResponsePatientDTO>.Fail("Mật khẩu và xác nhận mật khẩu không khớp.");

        Patient patient = await _userAccountRepository.CreateUserAccount_Patient_Async(userDto);
        if (patient == null)
            return ServiceResult<ResponsePatientDTO>.Fail("Tạo tài khoản thất bại.");

        var responsePatientDto = new ResponsePatientDTO
        {
            PatientId = patient.Id,
            FirstName = patient.FirstName,
            LastName = patient.LastName,
            DateOfBirth = patient.DateOfBirth,
            Gender = patient.Gender,
            Nationality = patient.Nationality,
            Email = patient.Email,
            Address = patient.Address,
            PhoneNumber = patient.PhoneNumber,
            PlaceOfResidence = patient.PlaceOfResidence
        };

        return ServiceResult<ResponsePatientDTO>.Success(responsePatientDto);
    }
    
    public async Task<ServiceResult<ResponsePatientDTO?>> GetUserAccountByIdAsync(Guid userId)
    {
        var userAccount = await _userAccountRepository.GetUserAccountByIdAsync(userId);
        if (userAccount == null)
            return ServiceResult<ResponsePatientDTO?>.Fail("Tài khoản không tồn tại.");

        return ServiceResult<ResponsePatientDTO?>.Success(userAccount);
    }
}
using System.Security.Claims;
using Application.Common.Utils;


namespace Application.Services.Account;
public class UserAccountService : IUserAccountService
{
    private readonly IUserAccountRepository _userAccountRepository;
    private readonly ICurrentUserService _currentUserService;

    public UserAccountService(IUserAccountRepository userAccountRepository, ICurrentUserService currentUserService)
    {
        _userAccountRepository = userAccountRepository;
        _currentUserService = currentUserService;
    }

    public Guid? CurrentUserId => _currentUserService.CurrentUserId;
    public string RoleId => _currentUserService.RoleId;

    public async Task<ServiceResult<ResponsePatientDTO>> CreateUserAccount_Patient_Async(RequestPatientDTO userDto)
    {
        if (await _userAccountRepository.GetUserAccountByCitizenIDAsync(userDto.CitizenID) != null)
            return ServiceResult<ResponsePatientDTO>.Fail("Số CMND/CCCD đã tồn tại.");

        if (userDto.Password != userDto.ConfirmPassword)
            return ServiceResult<ResponsePatientDTO>.Fail("Mật khẩu và xác nhận mật khẩu không khớp.");

        if (!string.IsNullOrWhiteSpace(userDto.Email) && await _userAccountRepository
            .IsEmailExistsAsync(userDto.Email))
            return ServiceResult<ResponsePatientDTO>.Fail("Email đã tồn tại.");

        if (!string.IsNullOrWhiteSpace(userDto.PhoneNumber) && await _userAccountRepository
            .IsPhoneNumberExistsAsync(userDto.PhoneNumber))
            return ServiceResult<ResponsePatientDTO>.Fail("Số điện thoại đã tồn tại!");


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
            RoleId = patient.RoleId,
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
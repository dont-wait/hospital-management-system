using Application.Common.DTOs.Patient;
using Application.Common.Utils;


namespace Application.Services.Account;
public class UserAccountService : IUserAccountService
{
    private readonly IUserAccountRepository _userAccountRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUserAccountMapper _userAccountMapper;
    private readonly IPatientMapper _patientMapper;

    public UserAccountService(IUserAccountRepository userAccountRepository, ICurrentUserService currentUserService, IUserAccountMapper userAccountMapper, IPatientMapper patientMapper)
    {
        _userAccountRepository = userAccountRepository;
        _currentUserService = currentUserService;
        _userAccountMapper = userAccountMapper;
        _patientMapper = patientMapper;
    }

    public async Task<ServiceResult<ResponsePatientDTO>> UpdateUserAccount_Patient_Async(Guid patientId, RequestUpdatePatient request)
    {
        var patientExisting = await _userAccountRepository.FindPatientWithAccountByIdAsync(patientId);
        if (patientExisting == null)
            return ServiceResult<ResponsePatientDTO>.Fail("Không tìm thấy thông tin người dùng");

        var accountOfPatient = patientExisting.UserAccount;
        if (accountOfPatient == null)
            return ServiceResult<ResponsePatientDTO>.Fail("Không tìm thấy tài khoản người dùng");

        //TODO: Xac thuc phone
        if (patientExisting.PhoneNumber != request.PhoneNumber)
        {
            //implement it
        }
        _userAccountMapper.Update(accountOfPatient, request);

        await _userAccountRepository.UpdateAccountAndPatientAsync(patientExisting, accountOfPatient);

        
        ResponsePatientDTO responsePatientDto = _patientMapper.MapToDto(patientExisting);

        return ServiceResult<ResponsePatientDTO>.Success(responsePatientDto);
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

        ResponsePatientDTO responsePatientDto = _patientMapper.MapToDto(patient);

        return ServiceResult<ResponsePatientDTO>.Success(responsePatientDto);
    }

    public async Task<ServiceResult<ResponseUserDTO?>> GetUserAccountByIdAsync(Guid userId)
    {
        var userAccount = await _userAccountRepository.FindPatientWithAccountByIdAsync(userId);
        if (userAccount == null)
            return ServiceResult<ResponseUserDTO?>.Fail("Tài khoản không tồn tại.");

        var userAccountDto = _userAccountMapper.MapToDto(userAccount.UserAccount!);

        return ServiceResult<ResponseUserDTO?>.Success(userAccountDto);
    }
}
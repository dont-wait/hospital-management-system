using Application.Common.DTOs.Patient;
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

    public async Task<ServiceResult<ResponseUpdatePatient>> UpdateUserAccount_Patient_Async(Guid patientId, RequestUpdatePatient request)
    {
        var patientExisting = await _userAccountRepository.FindPatientWithAccountByIdAsync(patientId);
        if (patientExisting == null)
            return ServiceResult<ResponseUpdatePatient>.Fail("Không tìm thấy thông tin người dùng");
        
        var accountOfPatient = patientExisting.UserAccount;
        if (accountOfPatient == null)
            return ServiceResult<ResponseUpdatePatient>.Fail("Không tìm thấy tài khoản người dùng");

        
        //TODO: Xac thuc phone
        if (patientExisting.PhoneNumber != request.PhoneNumber)
        {
            //implement it
        }
        
        // 🩺 Cập nhật thông tin bệnh nhân
        patientExisting.FirstName = request.FirstName;
        patientExisting.LastName = request.LastName;
        patientExisting.PhoneNumber = request.PhoneNumber;
        patientExisting.Gender = request.Gender;
        patientExisting.DateOfBirth = request.DateOfBirth;
        patientExisting.Address = request.Address;
        patientExisting.Nationality = request.Nationality;
        patientExisting.PlaceOfResidence = request.PlaceOfResidence;
        accountOfPatient.AvatarUrl = request.AvatarUrl;
        
        await _userAccountRepository.UpdateAccountAndPatientAsync(patientExisting, accountOfPatient);
        
        ResponseUpdatePatient responsePatientDto = new ResponseUpdatePatient
        {
            PatientId = patientId,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.PhoneNumber,
            Gender = request.Gender,
            DateOfBirth = request.DateOfBirth,
            Address = request.Address,
            Nationality = request.Nationality,
            PlaceOfResidence = request.PlaceOfResidence,
            AvatarUrl = request.AvatarUrl
        };
        return ServiceResult<ResponseUpdatePatient>.Success(responsePatientDto);
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
        var userAccount = await _userAccountRepository.FindPatientWithAccountByIdAsync(userId);
        if (userAccount == null)
            return ServiceResult<ResponseUserDTO?>.Fail("Tài khoản không tồn tại.");

        ResponseUserDTO userAccountDto = new ResponseUserDTO
        {
            UserAccountId = userAccount.Id,
            CitizenID = userAccount.UserAccount.CitizenID,
            AvatarUrl = userAccount.UserAccount?.AvatarUrl ?? string.Empty,
            Is_Active = userAccount.UserAccount?.Is_Active ?? 0,
            Patient = userAccount != null ? new ResponsePatientDTO
            {
                PatientId = userAccount.Id,
                FirstName = userAccount.FirstName,
                LastName = userAccount.LastName,
                PhoneNumber = userAccount.PhoneNumber,
                Email = userAccount.Email,
                RoleId = userAccount.RoleId,
            } : null,
        };

        return ServiceResult<ResponseUserDTO?>.Success(userAccountDto);
    }
}
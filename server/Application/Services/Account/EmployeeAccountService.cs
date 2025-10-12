using Domain.Enums;
using Application.Common.Utils;

namespace Application.Services.Account;
public class EmployeeAccountService : IEmployeeAccountService
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUserAccountRepository _userAccountRepository;

    public EmployeeAccountService(IEmployeeRepository employeeRepository, IUserAccountRepository userAccountRepository)
    {
        _employeeRepository = employeeRepository;
        _userAccountRepository = userAccountRepository;
    }

    public async Task<ServiceResult<ResponseDoctorDTO>> CreateDoctorAsync(RequestDoctorDTO doctorDto)
    {
        if (await _userAccountRepository.GetUserAccountByCitizenIDAsync(doctorDto.CitizenID) != null)
            return ServiceResult<ResponseDoctorDTO>.Fail("Số CMND/CCCD đã tồn tại.");

        if (doctorDto.Password != doctorDto.ConfirmPassword)
            return ServiceResult<ResponseDoctorDTO>.Fail("Mật khẩu và xác nhận mật khẩu không khớp.");


        // TODO: VERIFY EMAIL AND PHONE THAT REAL
        if (!string.IsNullOrWhiteSpace(doctorDto.Email) && await _userAccountRepository
            .IsEmailExistsAsync(doctorDto.Email))
            return ServiceResult<ResponseDoctorDTO>.Fail("Email đã tồn tại.");

        if (!string.IsNullOrWhiteSpace(doctorDto.PhoneNumber) && await _userAccountRepository
            .IsPhoneNumberExistsAsync(doctorDto.PhoneNumber))
            return ServiceResult<ResponseDoctorDTO>.Fail("Số điện thoại đã tồn tại.");

        string hashedPassword = HashPasswordUtil.HashPassword(doctorDto.Password);
        doctorDto.Password = hashedPassword;

        Doctor newDoctor = await _employeeRepository.CreateDoctorAsync(doctorDto);
        if (newDoctor == null)
            return ServiceResult<ResponseDoctorDTO>.Fail("Tạo tài khoản thất bại.");

        var responseDoctorDto = new ResponseDoctorDTO
        {
            DoctorId = newDoctor.Id,
            EmployeeId = newDoctor.Employee.Id,
            FirstName = newDoctor.Employee.FirstName,
            LastName = newDoctor.Employee.LastName,
            PhoneNumber = newDoctor.Employee.PhoneNumber,
            Email = newDoctor.Employee.Email,
            Specialization = newDoctor.Specialization,
            CertificateNumber = newDoctor.Employee.CertificateNumber,
            DateOfBirth = newDoctor.Employee.DateOfBirth,
            Gender = newDoctor.Employee.Gender,
            HireDate = newDoctor.Employee.HireDate,
            RoleId = RoleEnum.doctor.ToString().ToLower()
        };

        return ServiceResult<ResponseDoctorDTO>.Success(responseDoctorDto);
    }

        public async Task<ServiceResult<ResponseUpdateDoctorDTO>> UpdateUserAccount_Doctor_Async(Guid doctorId, RequestUpdateDoctorDTO request)
    {
        var doctorExisting = await _employeeRepository.FindDoctorWithAccountByIdAsync(doctorId);
        if (doctorExisting == null)
            return ServiceResult<ResponseUpdateDoctorDTO>.Fail("Không tìm thấy thông tin người dùng");

        var accountOfDoctor = doctorExisting.Employee.UserAccount;
        if (accountOfDoctor == null)
            return ServiceResult<ResponseUpdateDoctorDTO>.Fail("Không tìm thấy tài khoản người dùng");

        doctorExisting.Employee.FirstName = request.FirstName;
        doctorExisting.Employee.LastName = request.LastName;
        doctorExisting.Employee.PhoneNumber = request.PhoneNumber;
        doctorExisting.Employee.Gender = request.Gender;
        doctorExisting.Employee.DateOfBirth = request.DateOfBirth;
        doctorExisting.Employee.HireDate = request.HireDate;
        doctorExisting.Employee.CertificateNumber = request.CertificateNumber;
        doctorExisting.Specialization = request.Specialization;
        accountOfDoctor.AvatarUrl = request.AvatarUrl;

        await _employeeRepository.UpdateAccountAndDoctorAsync(doctorExisting, accountOfDoctor);
        
        ResponseUpdateDoctorDTO responseDoctorDto = new ResponseUpdateDoctorDTO
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.PhoneNumber,
            Gender = request.Gender,
            DateOfBirth = request.DateOfBirth,
            HireDate = request.HireDate,
            CertificateNumber = request.CertificateNumber,
            Specialization = request.Specialization,
            AvatarUrl = request.AvatarUrl
        };

        return ServiceResult<ResponseUpdateDoctorDTO>.Success(responseDoctorDto);
    }

    public async Task<ServiceResult<ResponseUserDTO?>> GetEmployeeByIdAsync(Guid employeeId)
    {
        var employee = await _employeeRepository.GetEmployeeByIdAsync(employeeId);
        if (employee == null)
            return ServiceResult<ResponseUserDTO?>.Fail("Nhân viên không tồn tại.");

        return ServiceResult<ResponseUserDTO?>.Success(employee);
    }
}
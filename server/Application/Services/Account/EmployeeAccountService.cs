using Domain.Enums;
using Application.Common.Utils;

namespace Application.Services.Account;

public class EmployeeAccountService : IEmployeeAccountService
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUserAccountRepository _userAccountRepository;

    private readonly IDoctorMapper _doctorMapper;
    private readonly IUserAccountMapper _userAccountMapper;

    public EmployeeAccountService(IEmployeeRepository employeeRepository, IUserAccountRepository userAccountRepository, IDoctorMapper doctorMapper, IUserAccountMapper userAccountMapper)
    {
        _employeeRepository = employeeRepository;
        _userAccountRepository = userAccountRepository;
        _doctorMapper = doctorMapper;
        _userAccountMapper = userAccountMapper;
        _doctorMapper = doctorMapper;
        
    }

    public async Task<ServiceResult<ResponseDoctorDTO>> CreateDoctorAsync(RequestDoctorDTO doctorDto)
    {
        if (await _userAccountRepository.GetUserAccountByCitizenIDAsync(doctorDto.CitizenID) != null)
            return ServiceResult<ResponseDoctorDTO>.Fail("Số CMND/CCCD đã tồn tại.");

        if (doctorDto.Password != doctorDto.ConfirmPassword)
            return ServiceResult<ResponseDoctorDTO>.Fail("Mật khẩu và xác nhận mật khẩu không khớp.");


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

        var responseDoctorDto = _doctorMapper.MapToDto(newDoctor);

        return ServiceResult<ResponseDoctorDTO>.Success(responseDoctorDto);
    }

    public async Task<ServiceResult<ResponseDoctorDTO>> UpdateUserAccount_Doctor_Async(Guid doctorId, RequestUpdateDoctorDTO request)
    {
        Doctor? existingDoctor = await _employeeRepository.FindDoctorWithAccountByIdAsync(doctorId);
        if (existingDoctor == null)
            return ServiceResult<ResponseDoctorDTO>.Fail("Không tìm thấy thông tin người dùng");


        var accountOfDoctor = existingDoctor.Employee.UserAccount;

        _doctorMapper.Update(existingDoctor, request);

        await _employeeRepository.UpdateAccountAndDoctorAsync(existingDoctor, accountOfDoctor);

        ResponseDoctorDTO responseDoctorDto = _doctorMapper.MapToDto(existingDoctor);

        return ServiceResult<ResponseDoctorDTO>.Success(responseDoctorDto);
    }

    public async Task<ServiceResult<ResponseUserDTO?>> GetEmployeeByIdAsync(Guid employeeId)
    {
        var userAccount = await _employeeRepository.GetEmployeeByIdAsync(employeeId);
        if (userAccount == null)
            return ServiceResult<ResponseUserDTO?>.Fail("Nhân viên không tồn tại.");

        ResponseEmployeeDTO? employeeDto = null;

        if (userAccount.Employee != null)
        {
            var employee = userAccount.Employee;

            if (employee.RoleId == RoleEnum.doctor.ToString().ToLower())
            {
                employeeDto = _doctorMapper.MapToDto(employee.Doctor!);
            }
            else if (employee.RoleId == RoleEnum.admin.ToString().ToLower())
            {
                employeeDto = new ResponseAdminDto
                {
                    EmployeeId = employee.Id,
                    FirstName = employee.FirstName,
                    LastName = employee.LastName,
                    PhoneNumber = employee.PhoneNumber,
                    Email = employee.Email,
                    CertificateNumber = employee.CertificateNumber,
                    DateOfBirth = employee.DateOfBirth,
                    Gender = employee.Gender,
                    HireDate = employee.HireDate,
                    RoleId = employee.RoleId
                };
            }
            else
            {
                employeeDto = new ResponseEmployeeDTO
                {
                    EmployeeId = employee.Id,
                    FirstName = employee.FirstName,
                    LastName = employee.LastName,
                    PhoneNumber = employee.PhoneNumber,
                    Email = employee.Email,
                    CertificateNumber = employee.CertificateNumber,
                    DateOfBirth = employee.DateOfBirth,
                    Gender = employee.Gender,
                    HireDate = employee.HireDate,
                    RoleId = employee.RoleId
                };
            }
        }

        ResponseUserDTO? responseUserDto = _userAccountMapper.MapToDto(userAccount);

        return ServiceResult<ResponseUserDTO?>.Success(responseUserDto);
    }

    public async Task<ServiceResult<List<ResponseUserDTO>>> GetAllDoctorsAsync()
    {
        List<UserAccount>? doctors = await _employeeRepository.GetAllDoctorAsync();

        if (doctors == null || doctors.Count == 0)
            return ServiceResult<List<ResponseUserDTO>>.Fail("Không tìm thấy bác sĩ nào");

        List<ResponseUserDTO> responseDoctors = doctors.Select(doctor => new ResponseUserDTO
        {
            UserAccountId = doctor.Employee.UserAccount.Id,
            AvatarUrl = doctor.Employee.UserAccount.AvatarUrl,
            Is_Active = doctor.Employee.UserAccount.Is_Active,
            CitizenID = doctor.CitizenID,
            Employee = doctor.Employee != null ? _doctorMapper.MapToDto(doctor.Employee.Doctor!) : null
        }).ToList();

        return ServiceResult<List<ResponseUserDTO>>.Success(responseDoctors);
    }
}
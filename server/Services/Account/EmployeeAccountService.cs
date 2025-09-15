using HospitalManagementSystem.DTOs.UserAccount;
using HospitalManagementSystem.Repositories.Employees;
using HospitalManagementSystem.Repositories.Account;
using HospitalManagementSystem.DTOs.Employee;
using Utils;

namespace HospitalManagementSystem.Services.Account;

public interface IEmployeeAccountService
{
    Task<ServiceResult<ResponseDoctorDTO>> CreateDoctorAsync(RequestDoctorDTO doctorDto);
    Task<ServiceResult<ResponseUserDTO?>> GetEmployeeByIdAsync(Guid employeeId);
}

class EmployeeAccountService : IEmployeeAccountService
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

        string hashedPassword = HashPasswordUtil.HashPassword(doctorDto.Password);
        doctorDto.Password = hashedPassword;

        Doctor doctor  = await _employeeRepository.CreateDoctorAsync(doctorDto);
        if (doctor == null)
            return ServiceResult<ResponseDoctorDTO>.Fail("Tạo tài khoản thất bại.");

        var responseDoctorDto = new ResponseDoctorDTO
        {
            DoctorId = doctor.Id,
            FirstName = doctor.Employee.FirstName,
            LastName = doctor.Employee.LastName,
            PhoneNumber = doctor.Employee.PhoneNumber,
            Email = doctor.Employee.Email,
            Specialization = doctor.Specialization,
            CertificateNumber = doctor.Employee.CertificateNumber,
            DateOfBirth = doctor.Employee.DateOfBirth,
            Gender = doctor.Employee.Gender,
            HireDate = doctor.Employee.HireDate,
        };

        return ServiceResult<ResponseDoctorDTO>.Success(responseDoctorDto);
    }

    public async Task<ServiceResult<ResponseUserDTO?>> GetEmployeeByIdAsync(Guid employeeId)
    {
        var employee = await _employeeRepository.GetEmployeeByIdAsync(employeeId);
        if (employee == null)
            return ServiceResult<ResponseUserDTO?>.Fail("Nhân viên không tồn tại.");

        return ServiceResult<ResponseUserDTO?>.Success(employee);
    }
}
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

    public async Task<ServiceResult<ResponseEmployeeDTO>> UpdateEmployeeAsync(Guid employeeId, string roleId, RequestUpdateEmployeeDTO request)
    {
        UserAccount? existingEmployee = await _employeeRepository.GetEmployeeByIdAndRoleIdAsync(employeeId, roleId);
        if (existingEmployee == null || existingEmployee.Employee == null || existingEmployee.Employee.DeletedAt != null)
            return ServiceResult<ResponseEmployeeDTO>.Fail("Không tìm thấy thông tin người dùng");


        var accountOfDoctorEmployee = existingEmployee.Employee.UserAccount;

        _doctorMapper.Update(existingEmployee.Employee.Doctor, request);

        await _employeeRepository.UpdateEmployeeAsync(existingEmployee.Employee, accountOfDoctorEmployee);

        ResponseEmployeeDTO responseDoctorDto = _doctorMapper.MapToDto(existingEmployee.Employee.Doctor);

        return ServiceResult<ResponseEmployeeDTO>.Success(responseDoctorDto);
    }

    public async Task<ServiceResult<ResponseUserDTO?>> GetEmployeeByIdAsync(Guid employeeId, string roleId)
    {
        var userAccount = await _employeeRepository.GetEmployeeByIdAndRoleIdAsync(employeeId, roleId);
        if (userAccount == null || userAccount.DeletedAt != null)
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
                    RoleId = RoleEnum.admin.ToString().ToLower()
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

    public async Task<ServiceResult<List<ResponseUserDTO>>> GetAllEmployeesByRoleIdAsync(string roleId)
    {
        if (string.IsNullOrWhiteSpace(roleId) ||
            (roleId.ToLower() != RoleEnum.doctor.ToString().ToLower() &&
             roleId.ToLower() != RoleEnum.admin.ToString().ToLower()))
            return ServiceResult<List<ResponseUserDTO>>.Fail("Vai trò không hợp lệ.");

        List<UserAccount>? doctors = await _employeeRepository.GetAllEmployeeByRoleIdAsync(roleId);

        if (doctors == null || doctors.Count == 0)
            return ServiceResult<List<ResponseUserDTO>>.Fail("Không tìm thấy bác sĩ nào");

        List<ResponseUserDTO> responseDoctors = doctors.Select(doctor => new ResponseUserDTO
        {
            UserAccountId = doctor.Employee!.UserAccount.Id,
            AvatarUrl = doctor.Employee.UserAccount.AvatarUrl,
            Is_Active = doctor.Employee.UserAccount.Is_Active,
            CitizenID = doctor.CitizenID,
            Employee = doctor.Employee != null && doctor.Employee.DeletedAt == null ? _doctorMapper.MapToDto(doctor.Employee.Doctor!) : null
        }).ToList();

        return ServiceResult<List<ResponseUserDTO>>.Success(responseDoctors);
    }

    public async Task<ServiceResult<bool>> DeleteEmployeeByIdAsync(Guid employeeId, string roleId)
    {
        var userAccount = await _employeeRepository.GetEmployeeByIdAndRoleIdAsync(employeeId, roleId);
        if (userAccount == null || userAccount.Employee == null || userAccount.DeletedAt != null)
            return ServiceResult<bool>.Fail("Nhân viên không tồn tại.");

        bool isDeleted = await _employeeRepository.DeleteEmployeeByIdAsync(userAccount.Employee);
        if (!isDeleted)
            return ServiceResult<bool>.Fail("Xóa nhân viên thất bại.");

        return ServiceResult<bool>.Success(true);
    }
}
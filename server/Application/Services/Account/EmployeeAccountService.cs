using Domain.Enums;
using Application.Common.Utils;

namespace Application.Services.Account;

public class EmployeeAccountService : IEmployeeAccountService
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUserAccountRepository _userAccountRepository;

    private readonly IDoctorMapper _doctorMapper;
    private readonly IUserAccountMapper _userAccountMapper;
    private readonly IEmployeeMapper _employeeMapper;

    public EmployeeAccountService(IEmployeeRepository employeeRepository, IUserAccountRepository userAccountRepository, IDoctorMapper doctorMapper, IUserAccountMapper userAccountMapper, IEmployeeMapper employeeMapper)
    {
        _employeeRepository = employeeRepository;
        _userAccountRepository = userAccountRepository;
        _doctorMapper = doctorMapper;
        _userAccountMapper = userAccountMapper;
        _employeeMapper = employeeMapper;
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

    public async Task<ServiceResult<ResponseEmployeeDTO>> UpdateEmployeeAsync(Guid employeeId, RequestUpdateEmployeeDTO request)
    {
        UserAccount? existingEmployee = await _employeeRepository.GetEmployeeByIdAsync(employeeId);
        if (existingEmployee == null || existingEmployee.Employee == null || existingEmployee.Employee.DeletedAt != null)
            return ServiceResult<ResponseEmployeeDTO>.Fail("Không tìm thấy thông tin người dùng");


        var accountOfDoctorEmployee = existingEmployee.Employee.UserAccount;

        _doctorMapper.Update(existingEmployee.Employee.Doctor, request);

        await _employeeRepository.UpdateEmployeeAsync(existingEmployee.Employee, accountOfDoctorEmployee);

        ResponseEmployeeDTO responseDoctorDto = _doctorMapper.MapToDto(existingEmployee.Employee.Doctor);

        return ServiceResult<ResponseEmployeeDTO>.Success(responseDoctorDto);
    }

    public async Task<ServiceResult<ResponseUserDTO?>> GetEmployeeByIdAsync(Guid employeeId)
    {
        UserAccount? userAccount = await _employeeRepository.GetEmployeeByIdAsync(employeeId);
        if (userAccount == null || userAccount.DeletedAt != null)
            return ServiceResult<ResponseUserDTO?>.Fail("Nhân viên không tồn tại.");

        ResponseEmployeeDTO? employeeDto = null;
        Employee? employee = userAccount.Employee;
        
        if (employee != null)
        {
            employeeDto = _employeeMapper.MapToDto(employee);
        }

        ResponseUserDTO responseUserDto = new ResponseUserDTO
        {
            UserAccountId = userAccount.Id,
            CitizenID = userAccount.CitizenID,
            AvatarUrl = userAccount.AvatarUrl ?? string.Empty,
            Is_Active = userAccount.Is_Active,
            Patient = null,
            Employee = employeeDto
        };

        return ServiceResult<ResponseUserDTO?>.Success(responseUserDto);
    }

    public async Task<ServiceResult<List<ResponseUserDTO>>> GetAllEmployeesByRoleIdAsync(string roleId)
    {
        if (string.IsNullOrWhiteSpace(roleId) ||
            (roleId.ToLower() != RoleEnum.doctor.ToString().ToLower() &&
             roleId.ToLower() != RoleEnum.admin.ToString().ToLower()))
            return ServiceResult<List<ResponseUserDTO>>.Fail("Vai trò không hợp lệ.");

        List<UserAccount>? employees = await _employeeRepository.GetAllEmployeeByRoleIdAsync(roleId);

        if (employees == null || employees.Count == 0)
            return ServiceResult<List<ResponseUserDTO>>.Fail("Không tìm thấy nhân viên nào");

        List<ResponseUserDTO> responseEmployees = employees.Select(userAccount => new ResponseUserDTO
        {
            UserAccountId = userAccount.Id,
            AvatarUrl = userAccount.AvatarUrl,
            Is_Active = userAccount.Is_Active,
            CitizenID = userAccount.CitizenID,
            Employee = userAccount.Employee != null && userAccount.Employee.DeletedAt == null 
                ? _employeeMapper.MapToDto(userAccount.Employee) 
                : null
        }).ToList();

        return ServiceResult<List<ResponseUserDTO>>.Success(responseEmployees);
    }

    public async Task<ServiceResult<bool>> DeleteEmployeeByIdAsync(Guid employeeId)
    {
        var userAccount = await _employeeRepository.GetEmployeeByIdAsync(employeeId);
        if (userAccount == null || userAccount.Employee == null || userAccount.DeletedAt != null)
            return ServiceResult<bool>.Fail("Nhân viên không tồn tại.");

        bool isDeleted = await _employeeRepository.DeleteEmployeeByIdAsync(userAccount.Employee);
        if (!isDeleted)
            return ServiceResult<bool>.Fail("Xóa nhân viên thất bại.");

        return ServiceResult<bool>.Success(true);
    }
}
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
    private readonly IDepartmentRepository _departmentRepository;

    public EmployeeAccountService(IEmployeeRepository employeeRepository, 
        IUserAccountRepository userAccountRepository, 
        IDoctorMapper doctorMapper, IUserAccountMapper 
            userAccountMapper, 
        IEmployeeMapper employeeMapper, 
        IDepartmentRepository departmentRepository)
    {
        _employeeRepository = employeeRepository;
        _userAccountRepository = userAccountRepository;
        _doctorMapper = doctorMapper;
        _userAccountMapper = userAccountMapper;
        _departmentRepository = departmentRepository;
        _employeeMapper = employeeMapper;
    }

    public async Task<ServiceResult<ResponseDoctorDTO>> CreateDoctorAsync(RequestDoctorDTO doctorDto, bool isHeadOfDepartment)
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

        if (await _departmentRepository.GetDepartmentByIdAsync(doctorDto.DepartmentId) == null)
            return ServiceResult<ResponseDoctorDTO>.Fail("Phòng ban không tồn tại.");

        string hashedPassword = HashPasswordUtil.HashPassword(doctorDto.Password);
        doctorDto.Password = hashedPassword;



        Doctor newDoctor = await _employeeRepository.CreateDoctorAsync(doctorDto, isHeadOfDepartment);
        if (newDoctor == null)
            return ServiceResult<ResponseDoctorDTO>.Fail("Tạo tài khoản thất bại.");

        var responseDoctorDto = _doctorMapper.MapToDto(newDoctor, isHeadOfDepartment);

        return ServiceResult<ResponseDoctorDTO>.Success(responseDoctorDto);
    }

    public async Task<ServiceResult<ResponseEmployeeDTO>> UpdateEmployeeAsync(Guid employeeId, RequestUpdateEmployeeDTO request, string currentUserRole)
    {
        UserAccount? existingUserAccount = await _employeeRepository.GetEmployeeByIdAsync(employeeId);
        if (existingUserAccount == null || existingUserAccount.Employee == null || existingUserAccount.Employee.DeletedAt != null)
            return ServiceResult<ResponseEmployeeDTO>.Fail("Không tìm thấy thông tin người dùng");

        Employee employee = existingUserAccount.Employee;
        UserAccount userAccount = existingUserAccount;

        _employeeMapper.Update(employee, request, currentUserRole);
        await _employeeRepository.UpdateEmployeeAsync(employee, userAccount);
        ResponseEmployeeDTO responseEmployeeDto = _employeeMapper.MapToDto(employee);

        return ServiceResult<ResponseEmployeeDTO>.Success(responseEmployeeDto);
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
        var validRoles = 
            new[] { RoleEnum.doctor.ToString(), RoleEnum.admin.ToString(), RoleEnum.hod.ToString() };
        
        if (string.IsNullOrWhiteSpace(roleId) || 
            !validRoles.Any(r => r.Equals(roleId, StringComparison.CurrentCultureIgnoreCase)))
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

using Application.Common.Utils;
public interface IEmployeeAccountService
{
    Task<ServiceResult<ResponseDoctorDTO>> CreateDoctorAsync(RequestDoctorDTO doctorDto);
    Task<ServiceResult<ResponseUserDTO?>> GetEmployeeByIdAsync(Guid employeeId, string roleId);
    Task<ServiceResult<ResponseEmployeeDTO>> UpdateEmployeeAsync(Guid employeeId, string roleId, RequestUpdateEmployeeDTO request);
    Task<ServiceResult<List<ResponseUserDTO>>> GetAllEmployeesByRoleIdAsync(string roleId);
    Task<ServiceResult<bool>> DeleteEmployeeByIdAsync(Guid employeeId, string roleId);
}
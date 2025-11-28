using Application.Common.Utils;
public interface IEmployeeAccountService
{
    Task<ServiceResult<ResponseDoctorDTO>> CreateDoctorAsync(RequestDoctorDTO doctorDto, bool isHeadOfDepartment);
    Task<ServiceResult<ResponseUserDTO?>> GetEmployeeByIdAsync(Guid employeeId);
    Task<ServiceResult<List<ResponseUserDTO>?>> GetEmployeeByIdsAsync(List<Guid> employeeIds);
    Task<ServiceResult<ResponseEmployeeDTO>> UpdateEmployeeAsync(Guid employeeId, RequestUpdateEmployeeDTO request, string currentUserRole);
    Task<ServiceResult<List<ResponseUserDTO>>> GetAllEmployeesAsync(string? roleId, int? departmentId);
    Task<ServiceResult<bool>> DeleteEmployeeByIdAsync(Guid employeeId);
}
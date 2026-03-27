public interface IEmployeeRepository
{
    Task<Doctor> CreateDoctorAsync(RequestDoctorDTO doctorDto, bool isHeadOfDepartment = false);
    Task<UserAccount?> GetEmployeeByIdAsync(Guid employeeId);
    Task<List<UserAccount>?> GetEmployeeByIdsAsync(List<Guid> employeeIds);
    Task<List<UserAccount>?> GetAllEmployeesAsync(string? roleId, int? departmentId);
    Task UpdateEmployeeAsync<T>(T employee, UserAccount userAccount) where T : Employee;
    Task<bool> DeleteEmployeeByIdAsync(Employee employee);
    Task<UserAccount?> GetDoctorByDoctorIdAsync(Guid doctorId);
    Task<Dictionary<Guid, Guid>> GetDoctorEmployeeMapByDepartmentIdAsync(int departmentId);
}
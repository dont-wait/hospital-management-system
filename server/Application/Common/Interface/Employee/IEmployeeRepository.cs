public interface IEmployeeRepository
{
    Task<Doctor> CreateDoctorAsync(RequestDoctorDTO doctorDto);
    Task<UserAccount?> GetEmployeeByIdAndRoleIdAsync(Guid employeeId, string roleId);
    Task<List<UserAccount>?> GetAllEmployeeByRoleIdAsync(string roleId);
    Task UpdateEmployeeAsync<T>(T employee, UserAccount userAccount) where T : Employee;
    Task<bool> DeleteEmployeeByIdAsync(Employee employee);
}
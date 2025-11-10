public interface IEmployeeRepository
{
    Task<Doctor> CreateDoctorAsync(RequestDoctorDTO doctorDto);
    Task<UserAccount?> GetEmployeeByIdAsync(Guid employeeId);
    Task<Doctor?> FindDoctorWithAccountByIdAsync(Guid doctorId);
    Task<List<UserAccount>?> GetAllDoctorAsync();
    Task UpdateAccountAndDoctorAsync(Doctor doctor, UserAccount userAccount);
    Task<bool> DeleteEmployeeByIdAsync(Employee employee);
}
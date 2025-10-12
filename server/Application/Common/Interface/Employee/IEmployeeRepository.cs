public interface IEmployeeRepository
{
    Task<Doctor> CreateDoctorAsync(RequestDoctorDTO doctorDto);
    Task<ResponseUserDTO?> GetEmployeeByIdAsync(Guid employeeId);
    Task<Doctor?> FindDoctorWithAccountByIdAsync(Guid doctorId);
    Task UpdateAccountAndDoctorAsync(Doctor doctor, UserAccount userAccount);
}
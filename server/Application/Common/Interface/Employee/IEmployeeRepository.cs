public interface IEmployeeRepository
{
    Task<Doctor> CreateDoctorAsync(RequestDoctorDTO doctorDto);
    Task<ResponseUserDTO?> GetEmployeeByIdAsync(Guid employeeId);
    Task<UserAccount?> FindDoctorWithAccountByIdAsync(Guid doctorId);
    Task<List<UserAccount>?> GetAllDoctorAsync();
    Task UpdateAccountAndDoctorAsync(Doctor doctor, UserAccount userAccount, RequestUpdateDoctorDTO request);
}
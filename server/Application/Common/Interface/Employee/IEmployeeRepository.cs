public interface IEmployeeRepository
{
    Task<Doctor> CreateDoctorAsync(RequestDoctorDTO doctorDto);
    Task<ResponseUserDTO?> GetEmployeeByIdAsync(Guid employeeId);
}
using Application.Common.Utils;
public interface IEmployeeAccountService
{
    Task<ServiceResult<ResponseDoctorDTO>> CreateDoctorAsync(RequestDoctorDTO doctorDto);
    Task<ServiceResult<ResponseUserDTO?>> GetEmployeeByIdAsync(Guid employeeId);
    Task<ServiceResult<ResponseDoctorDTO>> UpdateUserAccount_Doctor_Async(Guid doctorId, RequestUpdateDoctorDTO request);
    Task<ServiceResult<List<ResponseUserDTO>>> GetAllDoctorsAsync();
}
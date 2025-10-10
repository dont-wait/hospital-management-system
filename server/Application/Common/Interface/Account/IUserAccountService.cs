using Application.Common.DTOs.Patient;
using Application.Common.Utils;
public interface IUserAccountService
{
    Task<ServiceResult<ResponsePatientDTO>> CreateUserAccount_Patient_Async(RequestPatientDTO userDto);
    Task<ServiceResult<ResponseUserDTO?>> GetUserAccountByIdAsync(Guid userId);
    
    Task<ServiceResult<ResponseUpdatePatient>> UpdateUserAccount_Patient_Async(Guid patientId, RequestUpdatePatient request);
    
    Guid? CurrentUserId { get; }
    string RoleId { get; }
}

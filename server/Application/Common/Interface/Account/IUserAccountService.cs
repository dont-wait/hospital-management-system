using Application.Common.DTOs.Patient;
using Application.Common.Utils;
public interface IUserAccountService
{
    Task<ServiceResult<ResponsePatientDTO>> CreateUserAccount_Patient_Async(RequestPatientDTO userDto);
    Task<ServiceResult<ResponseUserDTO?>> GetUserAccountByIdAsync(Guid userId);
    Task<ServiceResult<ResponsePatientDTO>> UpdateUserAccount_Patient_Async(Guid patientId, RequestUpdatePatient request);
    Guid? CurrentUserId { get; }
    string RoleId { get; }

    Task<ServiceResult<bool>> DeletePatientByIdAsync(Guid patientId);
}

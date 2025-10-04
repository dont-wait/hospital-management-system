using Application.Common.Utils;
public interface IUserAccountService
{
    Task<ServiceResult<ResponsePatientDTO>> CreateUserAccount_Patient_Async(RequestPatientDTO userDto);
    Task<ServiceResult<ResponseUserDTO?>> GetUserAccountByIdAsync(Guid userId);
    Guid? CurrentUserId { get; }
    string RoleId { get; }
}

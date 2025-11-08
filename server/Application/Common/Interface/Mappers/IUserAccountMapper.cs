
using Application.Common.DTOs.Patient;

public interface IUserAccountMapper
{
    ResponseUserDTO MapToDto(UserAccount userAccount);
    UserAccount MapToEntity(RequestUserDTO userAccountDto);

    void Update(UserAccount userAccount, RequestUpdatePatient userAccountDto);
}

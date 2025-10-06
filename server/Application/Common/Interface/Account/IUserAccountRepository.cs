public interface IUserAccountRepository
{
    Task<Patient> CreateUserAccount_Patient_Async(RequestPatientDTO patientDto);
    Task<ResponseUserDTO?> GetUserAccountByIdAsync(Guid userId);
    Task<UserAccount?> GetUserAccountByCitizenIDAsync(string citizenID);

    Task<bool> IsEmailExistsAsync(string email);
    
    Task<bool> IsPhoneNumberExistsAsync(string phoneNumber);
    Task<UserAccount?> GetUserAccountByEmailAsync(string email);
    
    Task UpdateSync(UserAccount userAccount);
}
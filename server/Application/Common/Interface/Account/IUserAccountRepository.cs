public interface IUserAccountRepository
{
    Task<Patient> CreateUserAccount_Patient_Async(RequestPatientDTO patientDto);
    Task<UserAccount?> GetUserAccountByCitizenIDAsync(string citizenID);

    Task<bool> IsEmailExistsAsync(string email);
    
    Task<bool> IsPhoneNumberExistsAsync(string phoneNumber);
    Task<UserAccount?> GetUserAccountByEmailAsync(string email);
    Task<Patient?> FindPatientWithAccountByIdAsync(Guid patientId);
    Task UpdateSync(UserAccount userAccount);
    Task UpdateAccountAndPatientAsync(Patient patient, UserAccount userAccount);
}
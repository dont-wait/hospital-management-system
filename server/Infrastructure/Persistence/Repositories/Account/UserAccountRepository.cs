using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories.Account;
public class UserAccountRepository : IUserAccountRepository
{
    private readonly AppDbContext _context;

    public UserAccountRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Patient> CreateUserAccount_Patient_Async(RequestPatientDTO patientDto)
    {
        UserAccount userAccount = new UserAccount
        {
            CitizenID = patientDto.CitizenID,
            Password = patientDto.Password
        };

        await _context.user_accounts.AddAsync(userAccount);

        Patient patient = new Patient
        {
            FirstName = patientDto.FirstName,
            LastName = patientDto.LastName,
            PhoneNumber = patientDto.PhoneNumber,
            UserAccount = userAccount,
            Email = patientDto.Email,
            DateOfBirth = patientDto.DateOfBirth,
            Gender = patientDto.Gender,
            Nationality = patientDto.Nationality,
            Address = patientDto.Address,
            PlaceOfResidence = patientDto.PlaceOfResidence,
            RoleId = RoleEnum.patient.ToString().ToLower()
        };

        await _context.patients.AddAsync(patient);
        await _context.SaveChangesAsync();

        return patient;
    }

    public async Task<UserAccount?> GetUserAccountByCitizenIDAsync(string citizenID)
    {
        UserAccount? rs = await _context.user_accounts
            .Where(ua => ua.CitizenID == citizenID)
            .Include(ua => ua.Patient)
            .Include(ua => ua.Employee)
                .ThenInclude(e => e!.Doctor)
                .FirstOrDefaultAsync();

        return rs;
    }

    public async Task<string> GetEmailByUserIdAsync(Guid userId)
    {
        var email = await _context.user_accounts
            .Where(ua => ua.Id == userId)
            .Select(ua => ua.Patient != null ? ua.Patient.Email : ua.Employee != null ? ua.Employee.Email : null)
            .FirstOrDefaultAsync();
        return email ?? string.Empty;
    }

    public async Task<bool> IsPhoneNumberExistsAsync(string phoneNumber) =>
        await _context.patients
                .AnyAsync(p => p.PhoneNumber == phoneNumber)
            || await _context.employees
                .AnyAsync(e => e.PhoneNumber == phoneNumber);

    public async Task<bool> IsEmailExistsAsync(string email) =>
        await _context.patients
                .AnyAsync(p => p.Email == email)
            || await _context.employees
                .AnyAsync(e => e.Email == email);

    public Task<UserAccount?> GetUserAccountByEmailAsync(string email)
    {
        return _context.user_accounts
            .Include(ua => ua.Patient)
            .Include(ua => ua.Employee)
            .Where(ua => (ua.Patient != null && ua.Patient.Email == email) ||
                         (ua.Employee != null && ua.Employee.Email == email))
            .FirstOrDefaultAsync();
    }
    public async Task UpdateSync(UserAccount userAccount)
    {
        _context.user_accounts.Update(userAccount);
        await _context.SaveChangesAsync();
    }

    public async Task<Patient?> FindPatientWithAccountByIdAsync(Guid patientId)
    {
        var existingPatient = await _context.patients
            .Include(p => p.UserAccount)
            .FirstOrDefaultAsync(p => p.Id == patientId);
        return existingPatient;
    }

    // Cập nhật thông tin tài khoản cũng như thông tin của bệnh nhân
    public async Task UpdateAccountAndPatientAsync(Patient patient, UserAccount userAccount)
    {
        _context.patients.Update(patient);
        _context.user_accounts.Update(userAccount);
        await _context.SaveChangesAsync();
    }
}

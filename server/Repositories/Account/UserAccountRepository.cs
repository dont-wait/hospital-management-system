using HospitalManagementSystem.DTOs.Patient;
using HospitalManagementSystem.DTOs.UserAccount;
using Microsoft.EntityFrameworkCore;

namespace HospitalManagementSystem.Repositories.Account;

public interface IUserAccountRepository
{
    Task<Patient> CreateUserAccount_Patient_Async(RequestPatientDTO patientDto);
    Task<ResponseUserDTO?> GetUserAccountByIdAsync(Guid userId);
    Task<UserAccount?> GetUserAccountByCitizenIDAsync(string citizenID);
}

class UserAccountRepository : IUserAccountRepository
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
        };

        await _context.patients.AddAsync(patient);
        await _context.SaveChangesAsync();

        return patient;
    }

    public async Task<ResponseUserDTO?> GetUserAccountByIdAsync(Guid userId) => await _context.patients
        .Where(p => p.Id == userId)
        .Select(p => new ResponseUserDTO
        {
            UserAccountId = p.UserAccount.Id,
            AvatarUrl = p.UserAccount.AvatarUrl,
            Is_Active = p.UserAccount.Is_Active,
            CitizenID = p.UserAccount.CitizenID,
            Patient = new ResponsePatientDTO
            {
                PatientId = p.Id,
                FirstName = p.FirstName,
                LastName = p.LastName,
                PhoneNumber = p.PhoneNumber,
                Email = p.Email,
            }
        })
        .FirstOrDefaultAsync();

    public async Task<UserAccount?> GetUserAccountByCitizenIDAsync(string citizenID)
    {
        UserAccount? rs = await _context.user_accounts
            .Where(ua => ua.CitizenID == citizenID)
            .Include(ua => ua.Employee)
                .ThenInclude(e => e!.Doctor)
                .FirstOrDefaultAsync();

        Console.WriteLine($"Debug: Retrieved UserAccount {rs?.Employee?.Doctor.Specialization}");
        return rs;
    }
}   
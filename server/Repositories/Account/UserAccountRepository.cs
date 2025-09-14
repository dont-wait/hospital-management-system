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
            DateOfBirth = patientDto.DateOfBirth,
            Gender = patientDto.Gender,
            Nationality = patientDto.Nationality,
            Address = patientDto.Address,
            PhoneNumber = patientDto.PhoneNumber,
            PlaceOfResidence = patientDto.PlaceOfResidence,
            UserAccount = userAccount
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
                DateOfBirth = p.DateOfBirth,
                Gender = p.Gender,
                Nationality = p.Nationality,
                Address = p.Address,
                PhoneNumber = p.PhoneNumber,
                PlaceOfResidence = p.PlaceOfResidence
            }
        })
        .FirstOrDefaultAsync();

    public async Task<UserAccount?> GetUserAccountByCitizenIDAsync(string citizenID)
        => await _context.user_accounts
            .Where(ua => ua.CitizenID == citizenID)
            .Select(ua =>
                new UserAccount
                {
                    CitizenID = ua.CitizenID,
                    Password = ua.Password,
                    AvatarUrl = ua.AvatarUrl,
                    Is_Active = ua.Is_Active,
                    Id = ua.Id,
                    Patient = ua.Patient != null ? new Patient
                    {
                        Id = ua.Patient.Id,
                        FirstName = ua.Patient.FirstName,
                        LastName = ua.Patient.LastName,
                        DateOfBirth = ua.Patient.DateOfBirth,
                        Gender = ua.Patient.Gender,
                        Address = ua.Patient.Address,
                        PhoneNumber = ua.Patient.PhoneNumber,
                        PlaceOfResidence = ua.Patient.PlaceOfResidence,
                        Is_Insurance = ua.Patient.Is_Insurance,
                        Nationality = ua.Patient.Nationality,
                        RegistrationDate = ua.Patient.RegistrationDate,
                    } : null
                }
            )
            .FirstOrDefaultAsync();
}   
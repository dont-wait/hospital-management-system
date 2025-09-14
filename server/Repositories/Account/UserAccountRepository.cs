using HospitalManagementSystem.DTOs.Patient;
using HospitalManagementSystem.DTOs.UserAccount;
using Microsoft.EntityFrameworkCore;

namespace HospitalManagementSystem.Repositories.Account;

public interface IUserAccountRepository
{
    Task<Patient> CreateUserAccount_Patient_Async(RequestPatientDTO patientDto);
    Task<ResponseUserDTO?> GetUserAccountByIdAsync(Guid userId);
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
            Username = patientDto.Username,
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
            Email = patientDto.Email,
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
            Username = p.UserAccount.Username,
            Patient = new ResponsePatientDTO
            {
                PatientId = p.Id,
                FirstName = p.FirstName,
                LastName = p.LastName,
                DateOfBirth = p.DateOfBirth,
                Gender = p.Gender,
                Nationality = p.Nationality,
                Email = p.Email,
                Address = p.Address,
                PhoneNumber = p.PhoneNumber,
                PlaceOfResidence = p.PlaceOfResidence
            }
        })
        .FirstOrDefaultAsync();
}
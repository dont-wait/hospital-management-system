using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories.EmployeeRepository;
public class EmployeeRepository : IEmployeeRepository
{
    private readonly AppDbContext _context;

    public EmployeeRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserAccount>?> GetAllDoctorAsync()
    {
        var doctors = await _context.user_accounts
            .Include(d => d.Employee)
                .ThenInclude(e => e!.UserAccount)
                .ToListAsync();

        return doctors;
    }

    public async Task<Doctor> CreateDoctorAsync(RequestDoctorDTO doctorDto)
    {
        UserAccount userAccount = new UserAccount
        {
            CitizenID = doctorDto.CitizenID,
            Password = doctorDto.Password
        };

        await _context.user_accounts.AddAsync(userAccount);

        // Tạo Employee trước để lấy Id
        Employee employee = new Employee
        {
            FirstName = doctorDto.FirstName,
            LastName = doctorDto.LastName,
            PhoneNumber = doctorDto.PhoneNumber,
            UserAccount = userAccount,
            Email = doctorDto.Email,
            CertificateNumber = doctorDto.CertificateNumber,
            DateOfBirth = doctorDto.DateOfBirth,
            Gender = doctorDto.Gender,
            HireDate = doctorDto.HireDate,
            RoleId = RoleEnum.doctor.ToString().ToLower()
        };

        await _context.employees.AddAsync(employee);
        await _context.SaveChangesAsync(); // Để lấy được employee.Id

        Doctor doctor = new Doctor
        {
            Id = employee.Id, // Gán DoctorId bằng EmployeeId
            Specialization = doctorDto.Specialization,
            Employee = employee
        };

        await _context.doctors.AddAsync(doctor);
        await _context.SaveChangesAsync();

        return doctor;
    }

    public async Task<ResponseUserDTO?> GetEmployeeByIdAsync(Guid employeeId) => await _context.employees
        .Where(e => e.Id == employeeId)
        .Select(e => new ResponseUserDTO
        {
            UserAccountId = e.UserAccount.Id,
            AvatarUrl = e.UserAccount.AvatarUrl,
            Is_Active = e.UserAccount.Is_Active,
            CitizenID = e.UserAccount.CitizenID,
            Employee = new ResponseEmployeeDTO
            {
                EmployeeId = e.Id,
                FirstName = e.FirstName,
                LastName = e.LastName,
                PhoneNumber = e.PhoneNumber,
                Email = e.Email,
                CertificateNumber = e.CertificateNumber,
                DateOfBirth = e.DateOfBirth,
                Gender = e.Gender,
                HireDate = e.HireDate,
                Specialization = e.Doctor.Specialization,
                RoleId = e.RoleId
            }
        })
        .FirstOrDefaultAsync();

    public async Task<UserAccount?> FindDoctorWithAccountByIdAsync(Guid userAccountId)
    {
        var existingDoctor = await _context.user_accounts
            .Include(d => d.Employee)
                .ThenInclude(e => e!.Doctor)
            .FirstOrDefaultAsync(d => d.Id == userAccountId);
        return existingDoctor;
    }

    public async Task UpdateAccountAndDoctorAsync(Doctor doctor, UserAccount userAccount, RequestUpdateDoctorDTO request)
    {
        var employee = userAccount.Employee!;

        employee.FirstName = request.FirstName;
        employee.LastName = request.LastName;
        employee.PhoneNumber = request.PhoneNumber;
        employee.Gender = request.Gender;
        employee.DateOfBirth = request.DateOfBirth;
        employee.HireDate = request.HireDate;
        employee.CertificateNumber = request.CertificateNumber;
        doctor.Specialization = request.Specialization;
        userAccount.AvatarUrl = request.AvatarUrl;

        await _context.SaveChangesAsync();
    }   
}
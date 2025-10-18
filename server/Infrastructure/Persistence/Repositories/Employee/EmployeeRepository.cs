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
                .ThenInclude(e => e!.Doctor)
            .Where(ua => ua.Employee != null && ua.Employee.Doctor != null)
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
            Specialization = doctorDto.Specialization,
            Employee = employee
        };

        await _context.doctors.AddAsync(doctor);
        await _context.SaveChangesAsync();

        return doctor;
    }

    public async Task<UserAccount?> GetEmployeeByIdAsync(Guid employeeId)
    {
        return await _context.user_accounts
        .Include(ua => ua.Employee)
        .FirstOrDefaultAsync(ua => ua.Employee != null && ua.Employee.Id == employeeId);
    }

    public async Task<Doctor?> FindDoctorWithAccountByIdAsync(Guid doctorId)
    {
        var existingDoctor = await _context.doctors
            .Include(d => d.Employee)
            .FirstOrDefaultAsync(d => d.Id == doctorId && d.Employee != null);
        return existingDoctor;
    }

    public async Task UpdateAccountAndDoctorAsync(Doctor doctor, UserAccount userAccount)
    {
        _context.user_accounts.Update(userAccount);
        _context.doctors.Update(doctor);

        await _context.SaveChangesAsync();
    }
}
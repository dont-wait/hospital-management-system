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

    private IQueryable<UserAccount> GetEmployeeQueryByRoleId(string roleId)
    {
        var employees = _context.user_accounts
            .Include(e => e.Employee).AsQueryable();

        employees = roleId.ToLower() switch
        {
            "doctor" => employees
                .Where(ua => ua.Employee != null && ua.Employee.RoleId == RoleEnum.doctor.ToString().ToLower())
                .Include(ua => ua.Employee!.Doctor),

            "admin" => employees
                .Where(ua => ua.Employee != null && ua.Employee.RoleId == RoleEnum.admin.ToString().ToLower())
                .Include(ua => ua.Employee!.Admin),

            _ => employees
                .Where(ua => ua.Employee != null && ua.Employee.RoleId == roleId.ToLower())
        };

        return employees;
    }

    public async Task<List<UserAccount>?> GetAllEmployeeByRoleIdAsync(string roleId)
    {
        var employees = GetEmployeeQueryByRoleId(roleId);
        return await employees.ToListAsync();
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
            RoleId = RoleEnum.doctor.ToString().ToLower(),
            ExperienceYears = doctorDto.ExperienceYears,
            DepartmentId = doctorDto.DepartmentId
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
            .Where(ua => ua.Employee != null 
                && ua.Employee.Id == employeeId
                && ua.DeletedAt == null
                && ua.Employee.DeletedAt == null
            )
            .Include(ua => ua.Employee)
<<<<<<< HEAD
                //.ThenInclude(e => e!.Role)
            .Include(ua => ua.Employee!.Doctor)
            .Include(ua => ua.Employee!.Admin)
            .AsSplitQuery()
            .FirstOrDefaultAsync();
=======
                .ThenInclude(e => e!.Doctor)
            .Include(ua => ua.Employee)
                .ThenInclude(d => d!.Department)
            .FirstOrDefaultAsync(ua => ua.Employee != null && ua.Employee.Id == employeeId);
>>>>>>> 845a534 (fix: add missing field important in employee and config Department in query)
    }

    public async Task UpdateEmployeeAsync<T>(T employee, UserAccount userAccount) where T : Employee
    {
        _context.user_accounts.Update(userAccount);

        switch (employee.RoleId.ToLower())
        {
            case "doctor":
                if (employee.Doctor != null)
                {
                    _context.doctors.Update(employee.Doctor);
                }
                break;
            case "admin":
                if (employee.Admin != null)
                {
                    _context.admins.Update(employee.Admin);
                }
                break;
            default:
                break;
        }

        _context.employees.Update(employee);

        await _context.SaveChangesAsync();
    }

    public async Task<bool> DeleteEmployeeByIdAsync(Employee employee)
    {
        var userAccount = await _context.user_accounts
            .Include(ua => ua.Employee)
                .ThenInclude(e => e!.Doctor)
            .Include(ua => ua.Employee)
                .ThenInclude(e => e!.Admin)
            .FirstOrDefaultAsync(ua => ua.Employee != null && ua.Employee.Id == employee.Id);

        if (userAccount == null)
        {
            return false;
        }
        _context.user_accounts.Remove(userAccount);
        switch(userAccount.Employee!.RoleId)
        {
            case "doctor":
                if (userAccount.Employee.Doctor != null)
                    _context.doctors.Remove(userAccount.Employee.Doctor);
                break;
            case "admin":
                if (userAccount.Employee.Admin != null)
                    _context.admins.Remove(userAccount.Employee.Admin);
                break;
            default:
                break;
        }
        _context.employees.Remove(userAccount.Employee);

        return await _context.SaveChangesAsync() > 0;
    }
}
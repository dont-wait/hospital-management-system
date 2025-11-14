using System.Text.Json;
using Application.Common.Utils;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

public static class DataSeeder
{

    public static async Task SeedServicesAsync(AppDbContext context)
    {
        var seedPath = Path.Combine(AppContext.BaseDirectory, "Persistence", "SeedData", "services.json");

        if (!File.Exists(seedPath))
        {
            Console.WriteLine("❌ Không tìm thấy services.json");
            return;
        }

        var json = File.ReadAllText(seedPath);
        var servicesData = JsonSerializer.Deserialize<List<Service>>(json);

        if (servicesData == null)
        {
            Console.WriteLine("❌ Không thể đọc dữ liệu dịch vụ từ JSON");
            return;
        }

        foreach (var service in servicesData)
        {
            // Kiểm tra dịch vụ đã tồn tại chưa
            bool exists = await context.services.AnyAsync(s => s.Name == service.Name);
            if (exists)
            {
                continue;
            }

            context.services.Add(service);
            await context.SaveChangesAsync();
            Console.WriteLine($"✅ Seed dịch vụ {service.Name} thành công!");
        }
    }

    public static async Task SeedDoctorsAsync(AppDbContext context)
    {
        var seedPath = Path.Combine(AppContext.BaseDirectory, "Persistence", "SeedData", "doctors.json");

        if (!File.Exists(seedPath))
        {
            Console.WriteLine("❌ Không tìm thấy doctors.json");
            return;
        }

        var json = File.ReadAllText(seedPath);
        var doctorsData = JsonSerializer.Deserialize<List<DoctorSeedData>>(json);

        if (doctorsData == null)
        {
            Console.WriteLine("❌ Không thể đọc dữ liệu doctor từ JSON");
            return;
        }

        foreach (var doc in doctorsData)
        {
            // Kiểm tra bác sĩ đã tồn tại chưa
            bool exists = await context.user_accounts.AnyAsync(u => u.CitizenID == doc.CitizenID);
            if (exists)
            {
                continue;
            }

            // 1. Tạo Employee
            var employee = new Employee
            {
                Id = Guid.NewGuid(),
                FirstName = doc.FirstName,
                LastName = doc.LastName,
                DateOfBirth = doc.DateOfBirth,
                Gender = doc.Gender,
                PhoneNumber = doc.PhoneNumber,
                Email = doc.Email,
                HireDate = doc.HireDate,
                CertificateNumber = doc.CertificateNumber,
                RoleId = RoleEnum.doctor.ToString().ToLower(),
                ExperienceYears = doc.ExperienceYears,
                DepartmentId = doc.DepartmentId
            };
            context.employees.Add(employee);

            // 2. Tạo Doctor
            var doctor = new Doctor
            {
                Id = Guid.NewGuid(),
                EmployeeId = employee.Id,
                Specialization = doc.Specialization
            };
            context.doctors.Add(doctor);

            // 3. Tạo UserAccount
            var user = new UserAccount
            {
                Id = Guid.NewGuid(),
                CitizenID = doc.CitizenID,
                Password = HashPasswordUtil.HashPassword(doc.Password),
                EmployeeId = employee.Id,
                Is_Active = 1
            };
            context.user_accounts.Add(user);

            await context.SaveChangesAsync();
            Console.WriteLine($"✅ Seed doctor {doc.FirstName} {doc.LastName} thành công!");
        }
    }


    private class DoctorSeedData
    {
        public string CitizenID { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;

        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; } = "M";
        public string PhoneNumber { get; set; } = string.Empty;

        public string CertificateNumber { get; set; } = string.Empty;
        public int DepartmentId { get; set; }
        public string Specialization { get; set; } = string.Empty;
        public int ExperienceYears { get; set; }
        public DateTime HireDate { get; set; }
    }


    public static async Task SeedDepartmentsAndRoomAsync(AppDbContext appDbContext)
    {
        var seedPath = Path.Combine(AppContext.BaseDirectory, "Persistence", "SeedData", "departmentsHaveRooms.json");
        var json = File.ReadAllText(seedPath);

        var departmentData = JsonSerializer.Deserialize<List<Department>>(json);
        if (departmentData == null)
        {
            Console.WriteLine("❌ Không thể đọc dữ liệu phòng ban từ JSON");
            return;
        }

        foreach (var department in departmentData)
        {
            // Kiểm tra nếu phòng ban đã tồn tại
            var existingDepartment = await appDbContext.departments
                .Include(d => d.Rooms)
                .FirstOrDefaultAsync(d => d.Name == department.Name && d.Location == department.Location);

            if (existingDepartment == null)
            {
                // Thêm phòng ban mới cùng với các phòng bên trong
                appDbContext.departments.Add(department);
                Console.WriteLine($"✅ Đã thêm phòng ban: {department.Name} với {department.Rooms.Count} phòng.");
            }
            else
            {
                // Cập nhật các phòng nếu phòng ban đã tồn tại
                foreach (var room in department.Rooms)
                {
                    if (!existingDepartment.Rooms.Any(r => r.Name == room.Name))
                    {
                        existingDepartment.Rooms.Add(room);
                        Console.WriteLine($"✅ Đã thêm phòng: {room.Name} vào phòng ban: {existingDepartment.Name}");
                    }
                }
            }
        }
    }

    public static async Task SeedAdminAsync(AppDbContext context)
    {
        // Kiểm tra xem đã có admin chưa
        if (context.admins.Where(a => a.Employee.UserAccount.CitizenID == "000000000001").Any())
        {
            Console.WriteLine("✅ Admin đã tồn tại trong hệ thống");
            return;
        }

        var seedPath = Path.Combine(AppContext.BaseDirectory, "Persistence", "SeedData", "admins.json");
        var json = File.ReadAllText(seedPath);

        var adminData = JsonSerializer.Deserialize<AdminSeedData>(json);

        if (adminData == null)
        {
            Console.WriteLine("❌ Không thể đọc dữ liệu admin từ JSON");
            return;
        }

        // 1. Tạo Employee
        var employee = new Employee
        {
            Id = Guid.NewGuid(),
            FirstName = adminData.FirstName,
            LastName = adminData.LastName,
            DateOfBirth = adminData.DateOfBirth,
            Gender = adminData.Gender,
            PhoneNumber = adminData.PhoneNumber,
            Email = adminData.Email,
            HireDate = DateTime.UtcNow,
            CertificateNumber = adminData.CertificateNumber,
            RoleId = RoleEnum.admin.ToString().ToLower(),
            ExperienceYears = 5,
            DepartmentId = 10
        };
        context.employees.Add(employee);

        // 2. Tạo Admin
        var admin = new Admin
        {
            Id = Guid.NewGuid(),
            EmployeeId = employee.Id
        };
        context.admins.Add(admin);

        // 3. Tạo UserAccount
        var userAccount = new UserAccount
        {
            Id = Guid.NewGuid(),
            CitizenID = adminData.CitizenID,
            Password = HashPasswordUtil.HashPassword(adminData.Password),
            EmployeeId = employee.Id,
            Is_Active = 1
        };
        context.user_accounts.Add(userAccount);
        await context.SaveChangesAsync();

        Console.WriteLine($"✅ Đã tạo tài khoản admin với CitizenID: {adminData.CitizenID}");
    }

    private class AdminSeedData
    {
        public string CitizenID { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; } = "M";
        public string PhoneNumber { get; set; } = string.Empty;
        public string CertificateNumber { get; set; } = string.Empty;
    }

    public static async Task SeedAsync(AppDbContext context)
    {
        if (!context.roles.Any())
        {
            var seedPath = Path.Combine(AppContext.BaseDirectory, "Persistence", "SeedData", "roles.json");
            var json = File.ReadAllText(seedPath);
            var roles = JsonSerializer.Deserialize<List<Roles>>(json);
            if (roles != null)
                context.roles.AddRange(roles);
        }

        if (!context.permissions.Any())
        {
            var seedPath = Path.Combine(AppContext.BaseDirectory, "Persistence", "SeedData", "permissions.json");
            var json = File.ReadAllText(seedPath);
            var permissions = JsonSerializer.Deserialize<List<Permission>>(json);
            if (permissions != null)
                context.permissions.AddRange(permissions);
        }

        await context.SaveChangesAsync();

        if (!context.role_permissions.Any())
        {
            var seedPath = Path.Combine(AppContext.BaseDirectory, "Persistence", "SeedData", "rolepermissions.json");
            var json = File.ReadAllText(seedPath);
            var rolePerms = JsonSerializer.Deserialize<List<RolePermission>>(json);
            if (rolePerms != null)
                context.role_permissions.AddRange(rolePerms);
        }

        await context.SaveChangesAsync();
    }
}

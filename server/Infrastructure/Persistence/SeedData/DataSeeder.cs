using System.Text.Json;
using Application.Common.Utils;
using Microsoft.EntityFrameworkCore;

public static class DataSeeder
{

    public static async Task SeedAdminAsync(AppDbContext context)
    {
        // Kiểm tra xem đã có admin chưa
        if (context.admins.Where(a => a.Employee.UserAccount.CitizenID == "0000000001").Any())
        {
            Console.WriteLine("✅ Admin đã tồn tại trong hệ thống");
            return;
        }

        var rootPath = Directory.GetParent(AppContext.BaseDirectory)!.Parent!.Parent!.Parent!.Parent!.FullName;
        var seedPath = Path.Combine(rootPath, "Infrastructure", "Persistence", "SeedData", "admins.json");
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
            RoleId = "admin"
        };
        context.employees.Add(employee);
        await context.SaveChangesAsync();

        // 2. Tạo Admin
        var admin = new Admin
        {
            Id = Guid.NewGuid(),
            EmployeeId = employee.Id
        };
        context.admins.Add(admin);
        await context.SaveChangesAsync();

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
            var json = await File.ReadAllTextAsync("./SeedData/roles.json");
            var roles = JsonSerializer.Deserialize<List<Roles>>(json);
            if (roles != null)
                context.roles.AddRange(roles);
        }

        if (!context.permissions.Any())
        {
            var json = await File.ReadAllTextAsync("./SeedData/permissions.json");
            var permissions = JsonSerializer.Deserialize<List<Permission>>(json);
            if (permissions != null)
                context.permissions.AddRange(permissions);
        }

        await context.SaveChangesAsync();

        if (!context.role_permissions.Any())
        {
            var json = await File.ReadAllTextAsync("./SeedData/rolepermissions.json");
            var rolePerms = JsonSerializer.Deserialize<List<RolePermission>>(json);
            if (rolePerms != null)
                context.role_permissions.AddRange(rolePerms);
        }

        await context.SaveChangesAsync();
    }
}

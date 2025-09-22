using System.Text.Json;

public static class DataSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (!context.roles.Any())
        {
            var json = await File.ReadAllTextAsync("./data/SeedData/roles.json");
            var roles = JsonSerializer.Deserialize<List<Roles>>(json);
            if (roles != null)
                context.roles.AddRange(roles);
        }

        if (!context.permissions.Any())
        {
            var json = await File.ReadAllTextAsync("./data/SeedData/permissions.json");
            var permissions = JsonSerializer.Deserialize<List<Permission>>(json);
            if (permissions != null)
                context.permissions.AddRange(permissions);
        }

        await context.SaveChangesAsync();

        if (!context.role_permissions.Any())
        {
            var json = await File.ReadAllTextAsync("./data/SeedData/rolepermissions.json");
            var rolePerms = JsonSerializer.Deserialize<List<RolePermission>>(json);
            if (rolePerms != null)
                context.role_permissions.AddRange(rolePerms);
        }

        await context.SaveChangesAsync();
    }
}

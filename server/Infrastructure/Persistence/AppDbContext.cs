using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Admin> admins { get; set; } = null!;

    public DbSet<UserAccount> user_accounts { get; set; } = null!;
    public DbSet<Patient> patients { get; set; } = null!;
    public DbSet<Employee> employees { get; set; } = null!;
    public DbSet<Doctor> doctors { get; set; } = null!;
    public DbSet<Roles> roles { get; set; } = null!;
    public DbSet<RolePermission> role_permissions { get; set; } = null!;
    public DbSet<Permission> permissions { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        
        modelBuilder.Entity<Admin>()
            .HasOne(ua => ua.Employee)
            .WithOne(e => e.Admin)
            .HasForeignKey<Admin>(a => a.EmployeeId);
        
        modelBuilder.Entity<UserAccount>()
            .HasOne(ua => ua.Patient)
            .WithOne(p => p.UserAccount)
            .HasForeignKey<UserAccount>(ua => ua.PatientId);

        modelBuilder.Entity<UserAccount>()
            .HasOne(ua => ua.Employee)
            .WithOne(e => e.UserAccount)
            .HasForeignKey<UserAccount>(ua => ua.EmployeeId);

        modelBuilder.Entity<Doctor>()
            .HasOne(d => d.Employee)
            .WithOne(e => e.Doctor)
            .HasForeignKey<Doctor>(d => d.EmployeeId);

        // Composite key cho bảng trung gian
        modelBuilder.Entity<RolePermission>()
            .HasKey(rp => new { rp.RoleId, rp.PermissionId });

        modelBuilder.Entity<RolePermission>()
            .HasOne(rp => rp.Role)
            .WithMany(r => r.RolePermissions)
            .HasForeignKey(rp => rp.RoleId);

        modelBuilder.Entity<RolePermission>()
            .HasOne(rp => rp.Permission)
            .WithMany(p => p.RolePermissions)
            .HasForeignKey(rp => rp.PermissionId);

        base.OnModelCreating(modelBuilder);
    }
}

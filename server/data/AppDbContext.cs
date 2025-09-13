using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<UserAccount> user_accounts { get; set; } = null!;
    public DbSet<Patient> patients { get; set; } = null!;
    public DbSet<Employee> employees { get; set; } = null!;
    public DbSet<Doctor> doctors { get; set; } = null!;
    public DbSet<Nurse> nurses { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
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

        modelBuilder.Entity<Nurse>()
            .HasOne(n => n.Employee)
            .WithOne(e => e.Nurse)
            .HasForeignKey<Nurse>(n => n.EmployeeId);

        base.OnModelCreating(modelBuilder);
    }
}

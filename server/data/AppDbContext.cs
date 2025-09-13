using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

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
            .WithOne()
            .HasForeignKey<Doctor>(d => d.EmployeeId);

        modelBuilder.Entity<Nurse>()
            .HasOne(n => n.Employee)
            .WithOne()
            .HasForeignKey<Nurse>(n => n.EmployeeId);

        base.OnModelCreating(modelBuilder);
    }
}

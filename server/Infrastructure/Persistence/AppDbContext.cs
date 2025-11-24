using Domain.Entities.ScheduleTask;
using Microsoft.EntityFrameworkCore;
using Namotion.Reflection;

public class AppDbContext : DbContext
{
    private readonly ICurrentUserService _currentUserService;
    public AppDbContext(DbContextOptions<AppDbContext> options, ICurrentUserService currentUserService) : base(options)
    {
        _currentUserService = currentUserService;
    }
    
    public DbSet<MedicalVisit> medical_visits { get; set; } = null!;
    public DbSet<Billing> billings { get; set; } = null!;
    public DbSet<TaskItem> tasks { get; set; } = null!;
    public DbSet<TaskRegistration> task_registrations { get; set; } = null!;
    public DbSet<SlotTime> slot_times { get; set; } = null!;
    public DbSet<Appointment> appointments { get; set; } = null!;
    public DbSet<Service> services { get; set; } = null!;
    public DbSet<Department> departments { get; set; } = null!;
    public DbSet<Room> rooms { get; set; } = null!;
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

        modelBuilder.Entity<Billing>()
            .HasOne(b => b.Appointment)
            .WithMany()
            .IsRequired(false);

        modelBuilder.Entity<MedicalVisit>()
            .HasOne(mv => mv.Appointment)
            .WithMany()
            .IsRequired(false);

        
        
        modelBuilder.Entity<Appointment>(e =>
            {
                e.HasOne(a => a.Room)
                    .WithMany(d => d.Appointments)
                    .HasForeignKey(a => a.RoomId)
                    .OnDelete(DeleteBehavior.NoAction);
                e.HasOne(a => a.MedicalVisit)
                    .WithOne(mv => mv.Appointment)
                    .HasForeignKey<MedicalVisit>(mv => mv.AppointmentId);
                e.HasOne(a => a.Billing)
                    .WithOne(b => b.Appointment)
                    .HasForeignKey<Appointment>(a => a.BillingId);
            });
         
        modelBuilder.Entity<TaskItem>()
        .HasOne(t => t.Department)
        .WithMany(d => d.TaskItems)
        .HasForeignKey(t => t.DepartmentId)
        .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.HasOne(a => a.Patient)
                .WithMany(p => p.Appointments)     
                .HasForeignKey(a => a.PatientId)
                .OnDelete(DeleteBehavior.NoAction);

            entity.HasOne(a => a.Doctor)
                .WithMany(d => d.Appointments)     
                .HasForeignKey(a => a.DoctorId)
                .OnDelete(DeleteBehavior.NoAction);
            
            entity.HasQueryFilter(a => a.DeletedAt == null);
        });

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

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default) {
        var entries = ChangeTracker.Entries<BaseEntity>();
        foreach (var entry in entries)
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedId = _currentUserService.CurrentUserId ?? Guid.Empty;
                    entry.Entity.CreatedAt = DateTimeOffset.UtcNow;
                    break;
                case EntityState.Modified:
                    entry.Entity.ModifiedId = _currentUserService.CurrentUserId;
                    entry.Entity.UpdatedAt = DateTimeOffset.UtcNow;
                    break;
                case EntityState.Deleted:
                    entry.State = EntityState.Modified;
                    entry.Entity.DeletedId = _currentUserService.CurrentUserId;
                    entry.Entity.DeletedAt = DateTimeOffset.UtcNow;
                    entry.Property(_ => _.CreatedId).IsModified = false;
                    entry.Property(_ => _.CreatedAt).IsModified = false;
                    entry.Property(_ => _.ModifiedId).IsModified = false;
                    entry.Property(_ => _.UpdatedAt).IsModified = false;
                    break;
            }
        }
        return base.SaveChangesAsync(cancellationToken);
    }
}

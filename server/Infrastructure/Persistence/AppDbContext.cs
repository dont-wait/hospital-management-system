using System;
using System.Threading;
using System.Threading.Tasks;
using Domain.Entities.ScheduleTask;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    private readonly ICurrentUserService _currentUserService;
    public AppDbContext(DbContextOptions<AppDbContext> options, ICurrentUserService currentUserService) : base(options)
    {
        _currentUserService = currentUserService;
    }

    public DbSet<Prescription> prescriptions { get; set; } = null!;
    public DbSet<PrescriptionDetail> prescription_details { get; set; } = null!;
    public DbSet<MedicalVisit> medical_visits { get; set; } = null!;
    public DbSet<Billing> billings { get; set; } = null!;
    public DbSet<TaskItem> tasks { get; set; } = null!;
    public DbSet<TaskRegistration> task_registrations { get; set; } = null!;
    public DbSet<SlotTime> slot_times { get; set; } = null!;
    public DbSet<ScheduleRequest> schedule_requests { get; set; } = null!;
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
        modelBuilder.Entity<Department>()
            .HasIndex(d => d.Name)
            .IsUnique();

        modelBuilder.Entity<Room>()
            .ToTable(t =>
                t.HasCheckConstraint("CK_Room_Capacity", "[Capacity] >= 0")
            );

        modelBuilder.Entity<TaskItem>(entity =>
        {
            entity.Property(e => e.TaskStatus).IsRequired();

            entity.ToTable(t =>
                t.HasCheckConstraint(
                    "CK_Task_Status",
                    "[TaskStatus] IN ('Opened', 'Closed', 'Cancelled', 'Completed')"
                )
            );
        });

        modelBuilder.Entity<Appointment>()
            .ToTable(t =>
                t.HasCheckConstraint(
                    "CK_Appointment_Status",
                    "[AppointmentStatus] IN ('Pending','Unpaid','Paid','Confirmed','CheckIn','Completed','Cancelled','NoShow')"
                )
            );

        modelBuilder.Entity<SlotTime>(entity =>
        {
            entity.Property(e => e.SlotStatus).IsRequired();

            entity.ToTable(t =>
            {
                t.HasCheckConstraint("CK_Slot_Current", "[CurrentAppointments] >= 0");
                t.HasCheckConstraint("CK_Slot_Max", "[MaxAppointments] >= 0");
                t.HasCheckConstraint("CK_Slot_Range", "[CurrentAppointments] <= [MaxAppointments]");
                t.HasCheckConstraint("CK_Slot_Status",
                    "[SlotStatus] IN ('Opened', 'Closed', 'Full')");
            });
        });

        modelBuilder.Entity<ScheduleRequest>(entity =>
        {
            entity.ToTable("schedule_requests");
            entity.Property(e => e.Status).HasMaxLength(20);
            entity.Property(e => e.ServerlessRequestId).HasMaxLength(100);
            entity.HasOne(e => e.Department)
                .WithMany()
                .HasForeignKey(e => e.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Employee)
                .WithMany()
                .HasForeignKey(e => e.RequestedBy)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Patient>()
            .HasIndex(p => p.Email)
            .IsUnique();
        modelBuilder.Entity<Patient>()
            .HasIndex(p => p.PhoneNumber)
            .IsUnique();

        modelBuilder.Entity<Patient>()
            .ToTable(t =>
                t.HasCheckConstraint("CK_Patient_Gender", "[Gender] IN ('M','F','O')")
            );

        modelBuilder.Entity<Employee>()
            .HasIndex(e => e.Email)
            .IsUnique();

        modelBuilder.Entity<Employee>()
            .HasIndex(e => e.PhoneNumber)
            .IsUnique();

        modelBuilder.Entity<Employee>()
            .ToTable(t =>
                t.HasCheckConstraint("CK_Emp_Experience", "[ExperienceYears] >= 0")
            );

        modelBuilder.Entity<Billing>()
            .ToTable(t =>
            {
                t.HasCheckConstraint("CK_Billing_Discount", "[DiscountAmount] >= 0");
                t.HasCheckConstraint("CK_Billing_PayAmount", "[PaymentAmount] >= 0");
                t.HasCheckConstraint("CK_Billing_PaymentStatus",
                    "[PaymentMethod] IN ('PayAtCounter','EWallet')");
            });

        modelBuilder.Entity<PrescriptionDetail>()
            .ToTable(t =>
            {
                t.HasCheckConstraint("CK_PD_Dosage", "[Dosage] >= 0");
                t.HasCheckConstraint("CK_PD_Frequency", "[Frequency] >= 0");
                t.HasCheckConstraint("CK_PD_Duration", "[Duration] >= 0");
                t.HasCheckConstraint("CK_PD_Quantity", "[Quantity] >= 0");
            });

        modelBuilder.Entity<TaskRegistration>()
            .HasMany(tr => tr.SlotTimes)
            .WithOne(st => st.TaskRegistration)
            .HasForeignKey(st => st.TaskRegistrationId)
            .OnDelete(DeleteBehavior.Cascade);

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

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
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

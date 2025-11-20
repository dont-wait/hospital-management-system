using System.ComponentModel.DataAnnotations;
public class Appointment : BaseEntity
{
    [Key]
    public long Id { get; set; }
    [Required]
    public DateTimeOffset AppointmentDate { get; set; }
    
    public string AppointmentStatus { get; set; } = AppointmentStatusEnum.Pending.ToString();
    
    [Required]
    public Guid DoctorId { get; set; }
    public virtual Doctor? Doctor { get; set; }
    
    [Required]
    public int ServiceId { get; set; }
    public virtual Service? Service { get; set; }

    public virtual MedicalVisit? MedicalVisit { get; set; }

    public virtual Billing Billing { get; set; } = null!;
    public long? BillingId { get; set; }
    
    public virtual Room Room { get; set; } = null!;
    public int? RoomId { get; set; }
    
    [Required]
    public Guid PatientId { get; set; }
    public virtual Patient? Patient { get; set; }
}

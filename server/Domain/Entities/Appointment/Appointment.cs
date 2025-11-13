using System.ComponentModel.DataAnnotations;

public class Appointment : BaseEntity
{
    [Key]
    public long Id { get; set; }
    [Required]
    public Guid PatientId { get; set; }
    public virtual Patient? Patient { get; set; }
    [Required]
    public DateTimeOffset AppointmentDate { get; set; }
    [Required]
    public Guid DoctorId { get; set; }
    public virtual Doctor? Doctor { get; set; }
    [Required]
    public string AppointmentStatus { get; set; } = AppointmentStatusEnum.Scheduled.ToString();

    public virtual Service Service { get; set; } = null!;
    public int ServiceId { get; set; } = 5; //Mac dinh dang ky kham online la 5, 200k
}
using System.ComponentModel.DataAnnotations;
using Domain.Enums;

public class SlotTime : BaseEntity
{
    [Key]
    public long Id { get; set; }

    [Required]
    public long DoctorScheduleId { get; set; }
    public virtual DoctorSchedule DoctorSchedule { get; set; } = null!;

    [Required]
    public DateTimeOffset SlotStartTime { get; set; }
    [Required]
    public DateTimeOffset SlotEndTime { get; set; }

    public int MaxRegistrations { get; set; } = 5;
    public int CurrentRegistrations { get; set; } = 0;
    
    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    
    public string SlotStatus { get; set; } = SlotStatusEnum.Opened.ToString();
}
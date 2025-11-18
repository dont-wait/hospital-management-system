
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class DoctorSchedule : BaseEntity
{
    [Key]
    public long ScheduleId { get; set; }
    [Required]

    public Guid DoctorId { get; set; }
    public virtual Doctor? Doctor { get; set; }
    
    [Required]
    public DateTimeOffset StartTime { get; set; }
    [Required]
    public DateTimeOffset EndTime { get; set; }
    public int AvgVisitMinutes { get; set; } = 12;

    public ICollection<SlotTime> SlotTimes { get; set; } = new List<SlotTime>();
    public long EmployeeScheduleId { get; set; }
    public virtual EmployeeSchedule EmployeeSchedule { get; set; } = null!;
}
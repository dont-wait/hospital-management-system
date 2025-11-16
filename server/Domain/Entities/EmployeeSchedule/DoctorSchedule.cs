
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class DoctorSchedule
{

    [Key]
    public long ScheduleId { get; set; }
    [Required]

    public Guid DoctorId { get; set; }
    public virtual Doctor? Doctor { get; set; }
    
    [Required]
    public DateOnly ScheduleDate { get; set; }
    [Required]
    public TimeOnly StartTime { get; set; }
    [Required]
    public TimeOnly EndTime { get; set; }
    public int AvgVisitMinutes { get; set; } = 12;

    public ICollection<ScheduleSlot> ScheduleSlots { get; set; } = new List<ScheduleSlot>();
    public long EmployeeScheduleId { get; set; }
    public virtual EmployeeSchedule EmployeeSchedule { get; set; } = null!;
}
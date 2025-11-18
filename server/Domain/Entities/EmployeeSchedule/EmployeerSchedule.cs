using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Domain.Entities.ScheduleTask;


public class EmployeeSchedule : BaseEntity
{
    [Key]
    public long Id { get; set; } //ScheduleId

    [Required]
    public Guid EmployeeId { get; set; }
    public Employee Employee { get; set; } = null!;

    [Required]
    public long TaskId { get; set; }
    public virtual TaskItem Task { get; set; } = null!;

    public DoctorSchedule DoctorSchedule { get; set; } = null!;
    
    public virtual Department Department { get; set; } = null!;
    public int DepartmentId { get; set; }
    
    public virtual Room Room { get; set; } = null!;
    public int RoomId { get; set; }

    public string ScheduleStatus { get; set; } = null!;
}
using System.ComponentModel.DataAnnotations;
using Domain.Entities.ScheduleTask;


public class EmployeeSchedule : BaseEntity
{
    [Key]
    public long Id { get; set; }

    [Required]
    public Guid EmployeeId { get; set; }
    public Employee Employee { get; set; } = null!;
    
    [Required]
    public long TaskId { get; set; }
    public virtual TaskItem Task { get; set; } = null!;

    [Required]
    [Range(1, 50)]
    public int Capacity { get; set; } = 20;
    public int BookedCount { get; set; } = 0;
}
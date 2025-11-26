using System.ComponentModel.DataAnnotations;
using Domain.Enums;

namespace Domain.Entities.ScheduleTask;

public class TaskItem : BaseEntity 
{
    [Key]
    public long Id { get; set; }

    [Required, MaxLength(150)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public DateOnly Date { get; set; }

    [Required]
    public TimeOnly StartTime { get; set; }
    
    [Required]
    public TimeOnly EndTime { get; set; }
    
    [MaxLength(300)]
    public string Description { get; set; } = string.Empty; 

    [Required]
    public string TaskStatus { get; set; } = TaskStatusEnum.Opened.ToString();
    
    public ICollection<TaskRegistration> TaskRegistrations { get; set; } = new List<TaskRegistration>();
    
    public int? DepartmentId { get; set; } = null;
    public virtual Department? Department { get; set; } = null;
    
    public int? RoomId { get; set; } = null;
    public virtual Room? Room { get; set; } = null;

}
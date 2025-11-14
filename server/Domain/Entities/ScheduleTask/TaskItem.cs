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
    public DateTime StartTime { get; set; }
    
    [Required]
    public DateTime EndTime { get; set; }
    
    [MaxLength(300)]
    public string Description { get; set; } = string.Empty; 
    
    [Required]
    [Range(1, 30)]
    public int RequiredEmployees { get; set; }
    
    [Required]
    [Range(0, 30)]
    public int RegisteredEmployees { get; set; } = 0;
    
    [Required]
    public string Status { get; set; } = TaskStatusEnum.Opened.ToString();
    
    public ICollection<TaskRequirement> TaskRequirements { get; set; } = new List<TaskRequirement>();
}
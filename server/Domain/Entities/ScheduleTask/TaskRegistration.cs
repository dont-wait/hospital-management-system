using System.ComponentModel.DataAnnotations;

namespace Domain.Entities.ScheduleTask;

public class TaskRegistration : BaseEntity
{
    [Key]
    public long Id { get; set;} 
    
    [Required]
    public long TaskId { get; set; }
    public virtual TaskItem Task { get; set; } = null!;
    
    [Required]
    public Guid EmployeeId { get; set; }
    public virtual Employee Employee { get; set; } = null!;
    
    public ICollection<SlotTime> SlotTimes { get; set; } = new List<SlotTime>();
    
    //Cot createAt se la thoi gian employee dang ky tham gia task
}
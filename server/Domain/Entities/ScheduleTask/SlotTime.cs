using System.ComponentModel.DataAnnotations;
using Domain.Entities.ScheduleTask;
using Domain.Enums;

public class SlotTime : BaseEntity
{
    [Key]
    public long Id { get; set; }
    public TimeOnly SlotStartTime { get; set; }
    public TimeOnly SlotEndTime { get; set; }

    public int MaxAppointments { get; set; } = 5;
    public int CurrentAppointments { get; set; } = 0;
    
    public string SlotStatus { get; set; } = SlotStatusEnum.Opened.ToString();
    public long TaskItemId { get; set; }
    public TaskItem TaskItem { get; set; } = null!;
}
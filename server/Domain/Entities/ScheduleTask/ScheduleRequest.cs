using System.ComponentModel.DataAnnotations;

namespace Domain.Entities.ScheduleTask;

public class ScheduleRequest : BaseEntity
{
    [Key]
    public long Id { get; set; }

    public int DepartmentId { get; set; }
    public virtual Department? Department { get; set; }

    public Guid RequestedBy { get; set; }
    public virtual Employee? Employee { get; set; }

    public string Status { get; set; } = ScheduleEnum.PENDING.ToString();

    public string? HangfireJobId { get; set; }

    public string? RequestPayload { get; set; }

    public string? ResultData { get; set; }

    public string? ErrorMessage { get; set; }

    public DateOnly StartDate { get; set; }

    public int NumDays { get; set; }
}

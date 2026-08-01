using System.ComponentModel.DataAnnotations;
using Domain.Enums;

namespace Domain.Entities.ScheduleTask;

public class ScheduleRequest : BaseEntity
{
    [Key]
    public long Id { get; set; }

    public int DepartmentId { get; set; }
    public virtual Department? Department { get; set; }

    public Guid RequestedBy { get; set; }
    public virtual Employee? Employee { get; set; }

    public string Status { get; set; } = ScheduleEnum.QUEUED.ToString();

    public string? HangfireJobId { get; set; }

    public string? ServerlessRequestId { get; set; }

    public int ProgressPercent { get; set; }

    public string? RequestPayload { get; set; }

    public string? ResultData { get; set; }

    public string? MetricsData { get; set; }

    public string? ErrorMessage { get; set; }

    public DateOnly StartDate { get; set; }

    public int NumDays { get; set; }
}

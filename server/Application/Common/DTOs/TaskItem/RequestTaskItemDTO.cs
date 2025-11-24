using System.ComponentModel.DataAnnotations;
using Domain.Enums;

public class RequestTaskItemDTO
{ 
    [Required, MaxLength(150)]
    public string TaskName { get; set; } = string.Empty;

    [Required]
    public DateOnly Date { get; set; }

    [Required]
    public TimeOnly StartTime { get; set; }

    [Required]
    public TimeOnly EndTime { get; set; }

    [MaxLength(300)]
    public string Description { get; set; } = string.Empty;

    public int? DepartmentId { get; set; } = null;
    public int? RoomId { get; set; } = null;

    [Required]
    public List<RequestTaskRegistrationDTO> TaskRegistrations { get; set; } = new List<RequestTaskRegistrationDTO>();
}
using System.ComponentModel.DataAnnotations;

public class ResponseTaskRegistrationDTO
{
    [Required]
    public long TaskId { get; set; }
    
    [Required]
    public Guid EmployeeId { get; set; }
}
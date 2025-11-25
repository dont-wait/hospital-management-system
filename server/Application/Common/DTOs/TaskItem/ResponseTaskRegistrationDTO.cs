using System.ComponentModel.DataAnnotations;

public class ResponseTaskRegistrationDTO
{
    public long TaskId { get; set; }
    public Guid EmployeeId { get; set; }
}
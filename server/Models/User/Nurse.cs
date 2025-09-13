using System.ComponentModel.DataAnnotations;

public class Nurse
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(100)]
    public string Specialization { get; set; } = string.Empty;

    public Guid EmployeeId { get; set; }
    public Employee? Employee { get; set; }
}
using System.ComponentModel.DataAnnotations;

public class RequestDoctorDTO : RequestEmployeeDTO
{
    [Required]
    [StringLength(100)]
    public string Specialization { get; set; } = string.Empty;
}
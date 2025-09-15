using System.ComponentModel.DataAnnotations;

namespace HospitalManagementSystem.DTOs.Employee;

public class RequestDoctorDTO : RequestEmployeeDTO
{
    [Required]
    [StringLength(100)]
    public string Specialization { get; set; } = string.Empty;
}
using System.ComponentModel.DataAnnotations;

namespace HospitalManagementSystem.DTOs.Employee;

public class ResponseDoctorDTO : ResponseEmployeeDTO
{
    public Guid DoctorId { get; set; }
    public string Specialization { get; set; } = string.Empty;
}
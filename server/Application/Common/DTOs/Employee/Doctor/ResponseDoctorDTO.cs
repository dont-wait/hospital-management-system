using System.ComponentModel.DataAnnotations;

public class ResponseDoctorDTO : ResponseEmployeeDTO
{
    public Guid DoctorId { get; set; }
    public string Specialization { get; set; } = string.Empty;
}
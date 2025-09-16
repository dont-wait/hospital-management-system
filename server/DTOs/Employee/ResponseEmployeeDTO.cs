using HospitalManagementSystem.DTOs.UserAccount;

namespace HospitalManagementSystem.DTOs.Employee;

public class ResponseEmployeeDTO
{
    public Guid EmployeeId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime HireDate { get; set; }
    public string CertificateNumber { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;
}
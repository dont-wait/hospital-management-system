using Azure;
using HospitalManagementSystem.DTOs.UserAccount;

namespace HospitalManagementSystem.DTOs.Patient;

public class ResponsePatientDTO
{
    public Guid PatientId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public char Gender { get; set; } = ' ';
    public string Nationality { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string Address { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string PlaceOfResidence { get; set; } = string.Empty;
}
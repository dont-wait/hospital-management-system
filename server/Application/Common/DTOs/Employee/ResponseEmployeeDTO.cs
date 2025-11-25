using System.Text.Json.Serialization;

[JsonPolymorphic(TypeDiscriminatorPropertyName = "$type")]
[JsonDerivedType(typeof(ResponseDoctorDTO), typeDiscriminator: "doctor")]
[JsonDerivedType(typeof(ResponseAdminDto), typeDiscriminator: "admin")]
public class ResponseEmployeeDTO
{
    public Guid EmployeeId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateOnly DateOfBirth { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime HireDate { get; set; }
    public string CertificateNumber { get; set; } = string.Empty;
    public string RoleId { get; set; } = string.Empty;
    public int ExperienceYears { get; set; }
    public int? DepartmentId { get; set; }
    public string DepartmentName { get; set; } = string.Empty;
}
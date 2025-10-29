public class ResponseUpdateDoctorDTO
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public DateTime HireDate { get; set; }
    public string CertificateNumber { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
}
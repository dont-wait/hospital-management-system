public class ResponsePatientDTO
{
    public Guid PatientId { get; set; }
    public string CitizenID { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public DateOnly? DateOfBirth { get; set; } = null;
    public string? Gender { get; set; } = null;
    public string? Nationality { get; set; } = null;
    public string? Address { get; set; } = null;
    public string? PlaceOfResidence { get; set; } = null;
    public string RoleId { get; set; } = "patient";
}
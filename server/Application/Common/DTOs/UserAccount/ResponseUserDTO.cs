public class ResponseUserDTO
{
    public Guid UserAccountId { get; set; }
    public string CitizenID { get; set; } = null!;
    public string AvatarUrl { get; set; } = null!;
    public int Is_Active { get; set; }
    public ResponsePatientDTO? Patient { get; set; } = null;
    public ResponseEmployeeDTO? Employee { get; set; } = null;
}


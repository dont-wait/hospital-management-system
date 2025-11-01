using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("user_accounts")]
public class UserAccount
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [StringLength(12)]
    public string CitizenID { get; set; } = string.Empty;

    [Required]
    [MaxLength(30)]
    public string Password { get; set; } = string.Empty;

    public string AvatarUrl { get; set; } = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
    public int Is_Active { get; set; } = 1; //1:Active, 0:Inactive

    public Guid? PatientId { get; set; }
    public Patient? Patient { get; set; }

    public Guid? EmployeeId { get; set; }
    public Employee? Employee { get; set; }
}
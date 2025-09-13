using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("user_accounts")]
public class UserAccount
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(150)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [MaxLength(30)]
    public string Password { get; set; } = string.Empty;

    public string AvatarUrl { get; set; } = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
    public bool Is_Active { get; set; } = true;

    public Guid? PatientId { get; set; }
    public Patient? Patient { get; set; }

    public Guid? EmployeeId { get; set; }
    public Employee? Employee { get; set; }
}
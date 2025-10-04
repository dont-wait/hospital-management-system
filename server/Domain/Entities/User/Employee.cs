using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("employees")]
public class Employee
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(30)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    public DateTime DateOfBirth { get; set; }

    [Required]
    [Column(TypeName = "char(1)")]
    [MaxLength(1)]
    public string Gender { get; set; } = string.Empty;

    [Required]
    [MaxLength(10)]
    public string PhoneNumber { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public DateTime HireDate { get; set; }

    [Required]
    [Column(TypeName = "char(10)")]
    [StringLength(10)]
    public string CertificateNumber { get; set; } = string.Empty;

    public UserAccount UserAccount { get; set; } = null!;
    public Doctor Doctor { get; set; } = null!;

    [Required]
    [StringLength(20)]
    public string RoleId { get; set; } = null!;
    public Roles Role { get; set; } = null!;
}
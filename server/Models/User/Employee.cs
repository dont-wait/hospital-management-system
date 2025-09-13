using System.ComponentModel.DataAnnotations;

public class Employee
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(30)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    public DateTime DateOfBirth { get; set; }

    [Required]
    [MaxLength(1)]
    public char Gender { get; set; } = string.Empty[0];

    [Required]
    [MaxLength(10)]
    public string PhoneNumber { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public DateTime HireDate { get; set; }

    [Required]
    public char CertificateNumber { get; set; } = string.Empty[0];

    public UserAccount? UserAccount { get; set; }
}
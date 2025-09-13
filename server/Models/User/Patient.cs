using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("patients")]
public class Patient
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
    [MaxLength(150)]
    public string Nationality { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? Email { get; set; }

    [Required]
    public char Gender { get; set; } = ' ';

    [Required]
    [MaxLength(150)]
    public string PlaceOfResidence { get; set; } = string.Empty;

    public bool Is_Insurance { get; set; } = false;

    [Required]
    public string Address { get; set; } = string.Empty;

    [Required]
    [MaxLength(10)]
    public string PhoneNumber { get; set; } = string.Empty;

    public DateTime RegistrationDate { get; set; } = DateTime.Now;

    public UserAccount UserAccount { get; set; } = null!;
}
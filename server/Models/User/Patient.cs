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
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    public DateTime? DateOfBirth { get; set; } = null;

    [MaxLength(150)]
    public string? Nationality { get; set; } = null;

    public char? Gender { get; set; } = null;

    [MaxLength(150)]
    public string? PlaceOfResidence { get; set; } = null;


    public int Is_Insurance { get; set; } = 0; //0: Dont have insurance, 1:Have Insurance

    public string? Address { get; set; } = null;

    [Required]
    [MaxLength(10)]
    public string PhoneNumber { get; set; } = string.Empty;

    public DateTime RegistrationDate { get; set; } = DateTime.Now;

    public UserAccount UserAccount { get; set; } = null!;
}
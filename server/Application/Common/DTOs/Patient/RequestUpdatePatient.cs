using System.ComponentModel.DataAnnotations;

namespace Application.Common.DTOs.Patient;

public class RequestUpdatePatient
{
    [Required]
    [MaxLength(30)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [StringLength(10, MinimumLength = 10, ErrorMessage = "Số điện thoại phải đúng 10 chữ số.")]
    public string PhoneNumber { get; set; } = string.Empty;
    
    public DateTime? DateOfBirth { get; set; } = null;

    [MaxLength(150)]
    public string? Nationality { get; set; } = null;

    public char? Gender { get; set; } = null;

    [MaxLength(150)]
    public string? PlaceOfResidence { get; set; } = null;

    public string? Address { get; set; } = null;

    public string AvatarUrl { get; set; } = string.Empty;    
}
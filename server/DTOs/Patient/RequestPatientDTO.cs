using System.ComponentModel.DataAnnotations;
using HospitalManagementSystem.DTOs.UserAccount;

namespace HospitalManagementSystem.DTOs.Patient
{
    public class RequestPatientDTO : RequestUserDTO
    {
        [Required]
        [MaxLength(30)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(10)]
        public string PhoneNumber { get; set; } = string.Empty;
    }
}
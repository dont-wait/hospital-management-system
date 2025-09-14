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

        public DateTime DateOfBirth { get; set; }

        public char Gender { get; set; } = ' ';

        [Required]
        [MaxLength(150)]
        public string Nationality { get; set; } = string.Empty;

        [Required]
        public string Address { get; set; } = string.Empty;

        [Required]
        [MaxLength(10)]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        public string PlaceOfResidence { get; set; } = string.Empty;
    }
}
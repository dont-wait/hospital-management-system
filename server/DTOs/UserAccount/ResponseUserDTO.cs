using HospitalManagementSystem.DTOs.Patient;

namespace HospitalManagementSystem.DTOs.UserAccount
{
    public class ResponseUserDTO
    {
        public Guid UserAccountId { get; set; }
        public string CitizenID { get; set; } = null!;
        public string AvatarUrl { get; set; } = null!;
        public bool Is_Active { get; set; }
        public ResponsePatientDTO? Patient { get; set; }
    }
}
using Application.Common.DTOs.Patient;
using Domain.Enums;

public class PatientMapper : IPatientMapper
{
    public ResponsePatientDTO MapToDto(Patient patient)
    {
        return new ResponsePatientDTO
        {
            PatientId = patient.Id,
            CitizenID = patient.UserAccount!.CitizenID,
            AvatarUrl = patient.UserAccount!.AvatarUrl,
            FirstName = patient.FirstName,
            LastName = patient.LastName,
            Email = patient.Email,
            PhoneNumber = patient.PhoneNumber,
            DateOfBirth = patient.DateOfBirth,
            Gender = patient.Gender,
            Nationality = patient.Nationality,
            Address = patient.Address,
            PlaceOfResidence = patient.PlaceOfResidence,
            RoleId = RoleEnum.patient.ToString().ToLower()
        };
    }

    public Patient MapToEntity(RequestPatientDTO patientDto)
    {
        return new Patient
        {
            FirstName = patientDto.FirstName,
            LastName = patientDto.LastName,
            Email = patientDto.Email,
            PhoneNumber = patientDto.PhoneNumber,
            DateOfBirth = patientDto.DateOfBirth,
            Gender = patientDto.Gender,
            Nationality = patientDto.Nationality,
            Address = patientDto.Address,
            PlaceOfResidence = patientDto.PlaceOfResidence,
            RoleId = RoleEnum.patient.ToString().ToLower(),
            UserAccount = new UserAccount
            {
                AvatarUrl = patientDto.AvatarUrl,
                Is_Active = 1,
                CitizenID = patientDto.CitizenID
            }
        };
    }
}
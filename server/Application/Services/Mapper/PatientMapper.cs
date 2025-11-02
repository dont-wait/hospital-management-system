using Application.Common.DTOs.Patient;

public class PatientMapper : IPatientMapper
{
    public ResponsePatientDTO MapToDto(Patient patient)
    {
        return new ResponsePatientDTO
        {
            PatientId = patient.Id,
            FirstName = patient.FirstName,
            LastName = patient.LastName,
            Email = patient.Email,
            PhoneNumber = patient.PhoneNumber,
            DateOfBirth = patient.DateOfBirth,
            Gender = patient.Gender,
            Nationality = patient.Nationality,
            Address = patient.Address,
            PlaceOfResidence = patient.PlaceOfResidence,
            RoleId = "patient"
        };
    }

    public Patient MapToEntity(RequestPatientDTO patientDto)
    {
        throw new NotImplementedException();
    }
}
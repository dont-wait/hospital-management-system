using Application.Common.DTOs.Patient;

public interface IPatientMapper
{
    ResponsePatientDTO MapToDto(Patient patient);
    Patient MapToEntity(RequestPatientDTO patientDto);
}
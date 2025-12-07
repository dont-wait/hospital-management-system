using Application.Common.Utils;
public interface IMedicalVisitService
{
    Task<ServiceResult<ResponseMedicalVisitDTO>> CreateMedicalVisitAsync(RequestMedicalVisitDTO request);
    Task<ServiceResult<ResponseMedicalVisitDTO?>> GetMedicalVisitByIdAsync(long medicalVisitId);
    Task<ServiceResult<List<ResponseMedicalVisitDTO>>> GetMedicalVisitsByPatientIdAsync(Guid patientId);
}
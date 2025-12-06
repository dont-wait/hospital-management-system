using Application.Common.Utils;
public interface IPrescriptionService
{
    Task<ServiceResult<ResponsePrescriptionDTO>> CreatePrescriptionAsync(RequestPrescriptionDTO request);
    Task<ServiceResult<ResponsePrescriptionDTO?>> GetPrescriptionByIdAsync(long prescriptionId);
    Task<ServiceResult<List<ResponsePrescriptionDTO>>> GetPrescriptionsByMedicalVisitIdAsync(long medicalVisitId);
    Task<ServiceResult<List<ResponsePrescriptionDTO>>> GetPrescriptionsByPatientIdAsync(Guid patientId);
}
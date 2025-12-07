public interface IMedicalVisitRepository
{
    Task<MedicalVisit> CreateMedicalVisitAsync(MedicalVisit medicalVisit);
    Task<MedicalVisit?> GetMedicalVisitByIdAsync(long medicalVisitId);
    Task<List<MedicalVisit>> GetMedicalVisitsByPatientIdAsync(Guid patientId);
}
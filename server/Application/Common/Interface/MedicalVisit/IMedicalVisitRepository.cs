public interface IMedicalVisitRepository
{
    Task<MedicalVisit> CreateMedicalVisitAsync(MedicalVisit medicalVisit);
    Task<bool> IsExistingMedicalVisitByAppointmentIdAsync(long appointmentId);
    Task<MedicalVisit?> GetMedicalVisitByIdAsync(long medicalVisitId);
    Task<List<MedicalVisit>> GetMedicalVisitsByPatientIdAsync(Guid patientId);
}
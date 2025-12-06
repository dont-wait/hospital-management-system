public interface IPrescriptionRepository
{
    Task<Prescription> CreatePrescriptionAsync(Prescription prescription);
    Task<Prescription?> GetPrescriptionByIdAsync(long prescriptionId);
    Task<List<Prescription>> GetPrescriptionsByMedicalVisitIdAsync(long medicalVisitId);
    Task<List<Prescription>> GetPrescriptionsByPatientIdAsync(Guid patientId);
}
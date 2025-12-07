using Microsoft.EntityFrameworkCore;
public class PrescriptionRepository : IPrescriptionRepository
{
    private readonly AppDbContext _context;
    public PrescriptionRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Prescription> CreatePrescriptionAsync(Prescription prescription)
    {
        _context.prescriptions.Add(prescription);
        await _context.SaveChangesAsync();
        return prescription;
    }
    public async Task<Prescription?> GetPrescriptionByIdAsync(long prescriptionId)
    {
        return await _context.prescriptions
            .Include(p => p.PrescriptionDetails)
            .Include(p => p.MedicalVisit)
            .FirstOrDefaultAsync(p => p.Id == prescriptionId);
    }
    public async Task<List<Prescription>> GetPrescriptionsByMedicalVisitIdAsync(long medicalVisitId)
    {
        return await _context.prescriptions
            .Include(p => p.PrescriptionDetails)
            .Include(p => p.MedicalVisit)
            .Where(p => p.MedicalVisit.Id == medicalVisitId)
            .ToListAsync();
    }
    public async Task<List<Prescription>> GetPrescriptionsByPatientIdAsync(Guid patientId)
    {
        return await _context.prescriptions
            .Include(p => p.PrescriptionDetails)
            .Include(p => p.MedicalVisit)
                .ThenInclude(mv => mv!.Appointment)
            .Where(p => p.MedicalVisit.Appointment!.PatientId == patientId)
            .ToListAsync();
    }
}
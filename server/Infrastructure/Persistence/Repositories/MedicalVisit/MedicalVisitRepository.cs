using Microsoft.EntityFrameworkCore;
public class MedicalVisitRepository : IMedicalVisitRepository
{

    private readonly AppDbContext _context;
    public MedicalVisitRepository(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<MedicalVisit> CreateMedicalVisitAsync(MedicalVisit medicalVisit)
    {
        await _context.medical_visits.AddAsync(medicalVisit);
        await  _context.SaveChangesAsync();
        return medicalVisit;
    }
    public async Task<MedicalVisit?> GetMedicalVisitByIdAsync(long medicalVisitId)
    {
        MedicalVisit? medicalVisit = await _context.medical_visits
            .Include(mv => mv.Appointment)
            .FirstOrDefaultAsync(mv => mv.Id == medicalVisitId);
        return medicalVisit;
    }
    public async Task<List<MedicalVisit>> GetMedicalVisitsByPatientIdAsync(Guid patientId)
    {
        List<MedicalVisit> medicalVisits = await _context.medical_visits
            .Include(mv => mv.Appointment)
            .ThenInclude(mv => mv!.Patient)
            .Where(mv => mv.Appointment!.Patient!.Id == patientId)
            .ToListAsync();
        return medicalVisits;
    }
}
using Microsoft.EntityFrameworkCore;
public class BillingRepository : IBillingRepository
{

    private readonly AppDbContext _context;

    public BillingRepository(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<Billing> CreateBillingAsync(Billing billing)
    {
        
        await _context.billings.AddAsync(billing);
        await _context.SaveChangesAsync();
        return billing;
    }
    public async Task<Billing?> GetBillingByIdAsync(long billingId)
    {
        return await _context.billings
            .FirstOrDefaultAsync(b => b.Id == billingId);
    }
    public async Task<List<Billing>> GetBillingsAsync(string? status, 
        Guid? patientId, 
        Guid? doctorId, 
        int page, 
        int size)
    {
        if (page < 1) page = 1;
        if (size < 1) size = 10;
        var query = _context.billings
            .Include(b => b.Appointment)
            .ThenInclude(a => a.Patient)
            .AsQueryable();

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(a => a.BillingStatus.ToString() == status);
        }

        if (patientId.HasValue)
        {
            query = query.Where(a => a.Appointment!.PatientId == patientId.Value);
        }

        int totalRecords = await query.CountAsync();
        int totalPages = (int)Math.Ceiling((double)totalRecords / size);
        
        var appointments = await query.OrderByDescending(a => a.CreatedAt)
            .Skip((page - 1)  * size)
            .Take(size)
            .ToListAsync();

        return appointments;
    }
}
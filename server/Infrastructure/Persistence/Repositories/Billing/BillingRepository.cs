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
}
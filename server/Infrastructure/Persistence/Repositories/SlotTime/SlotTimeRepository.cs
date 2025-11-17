
using Microsoft.EntityFrameworkCore;

public class SlotTimeRepository : ISlotTimeRepository
{
    
    private readonly AppDbContext _context;

    public SlotTimeRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<SlotTime>> GetSlotTimesAsync(Specification<SlotTime> spec)
    {
        IQueryable<SlotTime> query = _context.slot_times.AsQueryable();

        query = query.Where(spec.Criteria);
        
        foreach (var include in spec.Includes)
            query = query.Include(include);
        
        if (spec.OrderBy != null)
            query = query.OrderBy(spec.OrderBy);
        else if (spec.OrderByDescending != null)
            query = query.OrderByDescending(spec.OrderByDescending);

        // PAGING
        if (spec.Skip.HasValue)
            query = query.Skip(spec.Skip.Value);

        if (spec.Take.HasValue)
            query = query.Take(spec.Take.Value);

        return await query.ToListAsync();
            
    }

    public async Task<SlotTime?> GetSlotTimeByIdAsync(Specification<SlotTime> spec)
    {
        IQueryable<SlotTime> query = _context.slot_times;

        query = query.Where(spec.Criteria);

        foreach (var include in spec.Includes)
            query = query.Include(include);

        return await query.FirstOrDefaultAsync();
    }

    public async Task AddSlotTimeAsync(SlotTime slot)
    {
        _context.slot_times.Add(slot);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateSlotTimeAsync(SlotTime slot)
    {
        _context.slot_times.Update(slot);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> DeleteAsync(SlotTime slot)
    {
        _context.slot_times.Remove(slot);
        await _context.SaveChangesAsync();
        return true;
    }
}
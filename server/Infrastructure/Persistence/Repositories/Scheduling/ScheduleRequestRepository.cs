using Application.Common.Interface.Scheduling;
using Domain.Entities.ScheduleTask;
using Microsoft.EntityFrameworkCore;

public class ScheduleRequestRepository : IScheduleRequestRepository
{
    private readonly AppDbContext _context;

    public ScheduleRequestRepository(AppDbContext context) => _context = context;

    public async Task<ScheduleRequest> AddAsync(ScheduleRequest request)
    {
        _context.schedule_requests.Add(request);
        await _context.SaveChangesAsync();
        return request;
    }

    public async Task<ScheduleRequest?> GetByIdAsync(long id)
    {
        return await _context.schedule_requests
            .Include(r => r.Department)
            .Include(r => r.Employee)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task UpdateAsync(ScheduleRequest request)
    {
        request.UpdatedAt = DateTimeOffset.UtcNow;
        _context.schedule_requests.Update(request);
        await _context.SaveChangesAsync();
    }

    public async Task<List<ScheduleRequest>> GetByDepartmentIdAsync(int departmentId)
    {
        return await _context.schedule_requests
            .Where(r => r.DepartmentId == departmentId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<(List<ScheduleRequest> Items, int TotalCount)> GetPagedByFilterAsync(
        int? departmentId = null,
        string? status = null,
        DateOnly? fromDate = null,
        DateOnly? toDate = null,
        int page = 1,
        int pageSize = 10)
    {
        var query = _context.schedule_requests
            .Include(r => r.Department)
            .Include(r => r.Employee)
            .AsQueryable();

        if (departmentId.HasValue)
            query = query.Where(r => r.DepartmentId == departmentId.Value);

        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(r => r.Status == status);

        if (fromDate.HasValue)
            query = query.Where(r => r.StartDate >= fromDate.Value);

        if (toDate.HasValue)
            query = query.Where(r => r.StartDate <= toDate.Value);

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }
}

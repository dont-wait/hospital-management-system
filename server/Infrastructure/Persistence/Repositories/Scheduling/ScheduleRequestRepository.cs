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
}

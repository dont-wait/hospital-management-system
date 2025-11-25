using Domain.Entities.ScheduleTask;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
public class TaskItemRepository : ITaskItemRepository
{
    private readonly AppDbContext _context;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly DateOnly _today = DateOnly.FromDateTime(DateTime.Today);
    
    public TaskItemRepository(AppDbContext context, IEmployeeRepository employeeRepository)
    {
        _context = context;
        _employeeRepository = employeeRepository;
    }
    
    public async Task<List<TaskItem>> GetAvailableTaskItemsForBooking(DateOnly? date,
        int? departmentId,
        Guid? doctorId)
    {
        var query = _context.tasks
            .Include(t => t.TaskRegistrations)
            .ThenInclude(tr => tr.SlotTimes) 
            .Include(t => t.TaskRegistrations)
            .ThenInclude(tr => tr.Employee)
            .ThenInclude(e => e.Doctor)
            .Include(t => t.Department)
            .Include(t => t.Room)
            .Where(t => t.TaskStatus == TaskStatusEnum.Opened.ToString()
                        && t.Date >= _today
                        && t.DeletedAt == null)
            .AsQueryable();

        if (date.HasValue)
            query = query.Where(t => t.Date == date.Value);

        if (departmentId.HasValue)
            query = query.Where(t => t.DepartmentId == departmentId.Value);

        if (doctorId.HasValue)
            query = query.Where(t => t.TaskRegistrations
                .Any(tr => tr.Employee.Doctor.Id == doctorId.Value));

        return query
            .Where(t => t.TaskRegistrations
                .Any(tr => tr.SlotTimes
                    .Any(s => s.CurrentAppointments < s.MaxAppointments)))
            .OrderBy(t => t.Date)
            .ThenBy(t => t.StartTime)
            .ToList();
    }

    public Task<TaskItem?> GetTaskItemBySlotTimeIdAsync(long slotTimeId)
    {
        var query = _context.tasks
            .Include(t => t.TaskRegistrations)
            .ThenInclude(tr => tr.SlotTimes)
            .Include(t => t.Room)
            .Where(t => t.TaskRegistrations
                            .Any(tr => tr.SlotTimes
                                .Any(s => s.Id == slotTimeId 
                                          && s.CurrentAppointments < s.MaxAppointments))
                        && t.TaskStatus == TaskStatusEnum.Opened.ToString() 
                        && t.Date >= _today
                        && t.DeletedAt == null);
        return query.FirstOrDefaultAsync();
    }
}
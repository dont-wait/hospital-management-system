using Domain.Entities.ScheduleTask;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
public class TaskItemRepository : ITaskItemRepository
{
    private readonly AppDbContext _context;
    private readonly IEmployeeRepository _employeeRepository;
    
    public TaskItemRepository(AppDbContext context, IEmployeeRepository employeeRepository)
    {
        _context = context;
        _employeeRepository = employeeRepository;
    }
    
    public List<TaskItem> GetAvailableTaskItemsForBooking(DateOnly? date, int? departmentId, Guid? doctorId)
    {
        var query = _context.tasks
            .Include(t => t.SlotTimes
                .Where(s => s.SlotStatus == SlotStatusEnum.Opened.ToString()))
            .Include(t => t.TaskRegistrations)
                .ThenInclude(tr => tr.Employee)
                .ThenInclude(tr => tr.Doctor)
            .Include(t => t.Department)
            .Include(t => t.Room)
            .Where(t => t.TaskStatus == TaskStatusEnum.Opened.ToString())
            .AsQueryable();
        
        if (date.HasValue)
            query = query.Where(t => t.Date == date.Value);
        else
            query = query.Where(t => t.Date >= DateOnly.FromDateTime(DateTime.Now)); //Lay lich tu hom nay tro di
                        
        if (departmentId.HasValue)
            query = query.Where(t => t.DepartmentId == departmentId.Value);

        if (doctorId.HasValue)
            query = query.Where(t => t.TaskRegistrations.Any(tr => tr.Employee.Doctor.Id == doctorId.Value));

        return query
            .Where(t => t.SlotTimes.Any())
            .OrderBy(t => t.Date)
            .ThenBy(t => t.StartTime)
            .ToList();
    }
}
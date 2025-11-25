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

    public async Task<TaskItem> CreateTaskItem(
        RequestTaskItemDTO requestTaskItemDTO,
        List<RequestTaskRegistrationDTO> taskRegistrations,
        List<SlotTime> slotTimes
    )
    {
        var startTime = slotTimes.First().SlotStartTime;
        var endTime = slotTimes.Last().SlotEndTime;

        var taskItem = new TaskItem
        {
            Name = requestTaskItemDTO.TaskName,
            Date = requestTaskItemDTO.Date,
            StartTime = startTime,
            EndTime = endTime,
            Description = requestTaskItemDTO.Description,
            TaskStatus = TaskStatusEnum.Opened.ToString(),
            DepartmentId = requestTaskItemDTO.DepartmentId,
            RoomId = requestTaskItemDTO.RoomId,
            TaskRegistrations = taskRegistrations.Select(tr => new TaskRegistration
            {
                EmployeeId = tr.EmployeeId,
                SlotTimes = slotTimes.Select(s => new SlotTime
                {
                    Id = s.Id,
                    SlotStartTime = s.SlotStartTime,
                    SlotEndTime = s.SlotEndTime,
                    MaxAppointments = s.MaxAppointments,
                    CurrentAppointments = s.CurrentAppointments,
                    SlotStatus = s.SlotStatus
                }).ToList()
            }).ToList()
        };

        Room? Room = await _context.rooms.FindAsync(requestTaskItemDTO.RoomId);

        taskItem.Room = Room;

        _context.tasks.Add(taskItem);
        await _context.SaveChangesAsync();

        return taskItem;
    }

    public async Task<List<TaskItem>> GetTaskItemByEmployeeId(Guid employeeId)
    {
        var taskItem = await _context.tasks
            .Where(t => t.TaskRegistrations.Any(tr => tr.EmployeeId == employeeId) 
                        && t.DeletedAt == null)
            .Select(t => new TaskItem
            {
                Id = t.Id,
                Name = t.Name,
                Date = t.Date,
                StartTime = t.StartTime,
                EndTime = t.EndTime,
                Description = t.Description,
                TaskStatus = t.TaskStatus,
                DepartmentId = t.DepartmentId,
                RoomId = t.RoomId,
                Department = t.Department,
                Room = t.Room,
                TaskRegistrations = t.TaskRegistrations
                    .Where(tr => tr.EmployeeId == employeeId)
                    .Select(tr => new TaskRegistration
                    {
                        Id = tr.Id,
                        EmployeeId = tr.EmployeeId,
                        Employee = tr.Employee,
                        SlotTimes = tr.SlotTimes
                    })
                    .ToList()
            })
            .OrderByDescending(t => t.Date)
            .ThenByDescending(t => t.StartTime)
            .ToListAsync();

        if (taskItem == null)
        {
            throw new Exception("Không tìm thấy TaskItem cho EmployeeId đã cho.");
        }

        return taskItem;
    }

    public async Task<bool> CheckEmployeeScheduleExists(Guid employeeId, DateOnly date, TimeOnly startTime, TimeOnly endTime)
    {
        return await _context.tasks
            .AnyAsync(t => t.Date == date
                        && t.StartTime == startTime
                        && t.EndTime == endTime
                        && t.DeletedAt == null
                        && t.TaskRegistrations.Any(tr => tr.EmployeeId == employeeId));
    }

    public async Task<List<Guid>> CheckEmployeesScheduleExists(List<Guid> employeeIds, DateOnly date, TimeOnly startTime, TimeOnly endTime)
    {
        return await _context.tasks
            .Where(t => t.Date == date
                        && t.StartTime == startTime
                        && t.EndTime == endTime
                        && t.DeletedAt == null)
            .SelectMany(t => t.TaskRegistrations
                .Where(tr => employeeIds.Contains(tr.EmployeeId))
                .Select(tr => tr.EmployeeId))
            .Distinct()
            .ToListAsync();
    }
}
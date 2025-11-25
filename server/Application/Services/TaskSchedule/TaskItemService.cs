using Application.Common.Utils;
using Application.Config.SlotTime;
using Domain.Entities.ScheduleTask;
using Domain.Enums;
public class TaskItemService : ITaskItemService
{
    private readonly ITaskItemRepository _taskItemRepository;
    private readonly ISlotTimeService _slotTimeService;
    
    public TaskItemService(ITaskItemRepository taskItemRepository, ISlotTimeService slotTimeService)
    {
        _taskItemRepository = taskItemRepository;
        _slotTimeService = slotTimeService;
    }

    public Task<ServiceResult<ResponseAvailableAppointment>> GetAvailableAppointments(DateOnly? date,
        int? departmentId,
        Guid? doctorId)
    {
        var today = DateOnly.FromDateTime(DateTime.Now);
        if (date.HasValue && date.Value < today)
            return Task.FromResult(
                ServiceResult<ResponseAvailableAppointment>.Fail("Ngày chọn phải lớn hơn hoặc bằng hôm nay"));

        var availableTaskItems = _taskItemRepository
            .GetAvailableTaskItemsForBooking(date, departmentId, doctorId);

        if (!availableTaskItems.Any())
        {
            return Task.FromResult(
                ServiceResult<ResponseAvailableAppointment>.Fail("Không có lịch khả dụng"));
        }

        var first = availableTaskItems.First();

        var response = new ResponseAvailableAppointment
        {
            Date = date ?? first.Date,
            DepartmentId = departmentId,
            DoctorId = doctorId,

            DepartmentName = first.Department?.Name ?? string.Empty,
            DepartmentDescription = first.Department?.Description ?? string.Empty,

            PriceOfService = 200000,

            Schedules = availableTaskItems
                .SelectMany(t => t.TaskRegistrations
                    .Where(tr => tr.Employee?.Doctor != null)
                    .Select(tr => new ResponseTaskItemDTO
                    {
                        ScheduleId = t.Id,
                        StartTime = t.Date.ToDateTime(t.StartTime),
                        EndTime = t.Date.ToDateTime(t.EndTime),
                        ScheduleStatus = t.TaskStatus,
                        DepartmentId = t.Department!.Id,

                        DoctorId = tr.Employee.Doctor.Id,

                        FullName = $"{tr.Employee.FirstName} {tr.Employee.LastName}",
                        Specialization = tr.Employee.Doctor.Specialization,
                        RoomName = t.Room!.Name,

                        Slots = tr.SlotTimes
                            .Select(s => new ResponseSlotTimeDTO
                            {
                                SlotId = s.Id,
                                SlotStatus = s.SlotStatus,
                                SlotStartTime = s.SlotStartTime,
                                SlotEndTime = s.SlotEndTime
                            })
                            .ToList()
                    }))
                .ToList()
        };
        return Task.FromResult(ServiceResult<ResponseAvailableAppointment>.Success(response));
    }

    public async Task<ServiceResult<ResponseTaskItemDTO>> CreateTaskItemAsync(
        RequestTaskItemDTO requestTaskItemDTO,
        List<RequestTaskRegistrationDTO> taskRegistrations
    )
    {
        bool hasDuplicateEmployeeIds = IsEmployeeIdDuplicate(taskRegistrations);
        if (hasDuplicateEmployeeIds)
        {
            return ServiceResult<ResponseTaskItemDTO>.Fail("Danh sách nhân viên đăng ký không được chứa ID trùng lặp.");
        }
        
        List<SlotTime> slotTimes = GenerateSlotTimes(requestTaskItemDTO);
        TaskItem createdTaskItem = await _taskItemRepository.CreateTaskItem(
            requestTaskItemDTO,
            taskRegistrations,
            slotTimes
        );

        var response = new ResponseTaskItemDTO
        {
            ScheduleId = createdTaskItem.Id,
            StartTime = createdTaskItem.Date.ToDateTime(createdTaskItem.StartTime),
            EndTime = createdTaskItem.Date.ToDateTime(createdTaskItem.EndTime),
            ScheduleStatus = createdTaskItem.TaskStatus,
            DepartmentId = createdTaskItem.DepartmentId ?? 0,
            RoomName = createdTaskItem.Room?.Name ?? string.Empty,
            TaskRegistrations = createdTaskItem.TaskRegistrations
                .Select(tr => new ResponseTaskRegistrationDTO
                {
                    EmployeeId = tr.EmployeeId,
                })
                .ToList(),
            Slots = slotTimes
                .Select(s => new ResponseSlotTimeDTO
                {
                    SlotId = s.Id,
                    SlotStartTime = s.SlotStartTime,
                    SlotEndTime = s.SlotEndTime,
                    SlotStatus = s.SlotStatus
                })
                .ToList()
        };

        return ServiceResult<ResponseTaskItemDTO>.Success(response);
    } 

    public async Task<ServiceResult<List<ResponseTaskItemDTO>>> GetTaskItemByEmployeeIdAsync(Guid employeeId)
    {
        List<TaskItem> taskItem = await _taskItemRepository.GetTaskItemByEmployeeId(employeeId);
        if (taskItem == null || !taskItem.Any() || taskItem.Count == 0)
        {
            return ServiceResult<List<ResponseTaskItemDTO>>.Fail("Không tìm thấy lịch làm việc cho nhân viên này");
        }

        List<ResponseTaskItemDTO> response = taskItem.Select(t => new ResponseTaskItemDTO
        {
            ScheduleId = t.Id,
            StartTime = t.Date.ToDateTime(t.StartTime),
            EndTime = t.Date.ToDateTime(t.EndTime),
            ScheduleStatus = t.TaskStatus,
            DepartmentId = t.DepartmentId ?? 0,
            RoomName = t.Room?.Name ?? string.Empty,
            TaskRegistrations = t.TaskRegistrations
                .Where(tr => tr.EmployeeId == employeeId)
                .Select(tr => new ResponseTaskRegistrationDTO
                {
                    EmployeeId = tr.EmployeeId,
                })
                .ToList(),
            Slots = t.TaskRegistrations
                .Where(tr => tr.EmployeeId == employeeId)
                .SelectMany(tr => tr.SlotTimes)
                .Select(s => new ResponseSlotTimeDTO
                {
                    SlotId = s.Id,
                    SlotStartTime = s.SlotStartTime,
                    SlotEndTime = s.SlotEndTime,
                    SlotStatus = s.SlotStatus
                })
                .ToList()
        }).ToList();

        return ServiceResult<List<ResponseTaskItemDTO>>.Success(response);
    }

    private List<SlotTime> GenerateSlotTimes(RequestTaskItemDTO task)
    {
        SlotTimeConfig slotTimeConfig = _slotTimeService.GetSlotTimeConfig<SlotTimeConfig>();
    
        List<SlotTime>? slots = new List<SlotTime>();
        TimeOnly current = task.StartTime;
        TimeSpan slotDuration = TimeSpan.FromHours(1);

        while (current < task.EndTime)
        {
            var next = current.Add(slotDuration);
            if (next > task.EndTime)
                next = task.EndTime;

            slots.Add(new SlotTime
            {
                SlotStartTime = current,
                SlotEndTime = next,
                MaxAppointments = slotTimeConfig.DefaultMaxAppointments,
                CurrentAppointments = 0,
                SlotStatus = SlotStatusEnum.Opened.ToString(),
            });

            current = next;
        }

        return slots;
    }

    private bool IsEmployeeIdDuplicate(List<RequestTaskRegistrationDTO> taskRegistrations)
    {
        var employeeIds = taskRegistrations.Select(tr => tr.EmployeeId);
        return employeeIds.Count() != employeeIds.Distinct().Count();
    }
}
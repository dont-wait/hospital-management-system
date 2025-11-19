using Application.Common.Utils;
using Domain.Enums;
public class TaskItemSerivce : ITaskItemService
{
    private readonly ITaskItemRepository _taskItemRepository;
    
    public TaskItemSerivce(ITaskItemRepository taskItemRepository)
    {
        _taskItemRepository = taskItemRepository;
    }
    
    public Task<ServiceResult<ResponseAvailableAppointment>> 
        GetAvailableAppointments(DateOnly? date, int? departmentId, Guid? doctorId)
    {
        if (date == null)
            date = DateOnly.FromDateTime(DateTime.Now);
            
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
            DepartmentId = departmentId ?? first.DepartmentId ?? 0,
            DoctorId = doctorId,

            DepartmentName = first.Department?.Name ?? string.Empty,
            DepartmentDescription = first.Department?.Description ?? string.Empty,

            PriceOfService = 200000,

            Schedules = availableTaskItems.Select(t =>
            {
                var doctorReg = t.TaskRegistrations
                    .FirstOrDefault(tr => tr.Employee?.Doctor != null);

                return new ResponseTaskItemDTO
                {
                    ScheduleId = t.Id,
                    StartTime = t.Date.ToDateTime(t.StartTime),
                    EndTime = t.Date.ToDateTime(t.EndTime),
                    ScheduleStatus = t.TaskStatus,
                    
                    DoctorId = doctorReg?.Employee.Doctor.Id ?? Guid.Empty,

                    FullName = doctorReg != null
                        ? $"{doctorReg.Employee.FirstName} {doctorReg.Employee.LastName}"
                        : string.Empty,
                    Specialization = doctorReg!.Employee.Doctor.Specialization,
                    
                    Slots = t.SlotTimes
                        .Where(s => s.SlotStatus == SlotStatusEnum.Opened.ToString())
                        .Select(s => new ResponseSlotTimeDTO
                        {
                            SlotId = s.Id,
                            SlotStatus = s.SlotStatus,
                            SlotStartTime = s.SlotStartTime,
                            SlotEndTime = s.SlotEndTime
                        })
                        .ToList()
                };
            }).ToList()
        };

        return Task.FromResult(ServiceResult<ResponseAvailableAppointment>.Success(response));
    }

}
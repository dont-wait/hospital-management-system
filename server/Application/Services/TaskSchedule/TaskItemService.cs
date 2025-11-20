using Application.Common.Utils;
using Domain.Enums;
public class TaskItemService : ITaskItemService
{
    private readonly ITaskItemRepository _taskItemRepository;
    
    public TaskItemService(ITaskItemRepository taskItemRepository)
    {
        _taskItemRepository = taskItemRepository;
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
                    DepartmentId = t.Department!.Id,

                    DoctorId = doctorReg?.Employee.Doctor.Id ?? Guid.Empty,

                    FullName = doctorReg != null
                        ? $"{doctorReg.Employee.FirstName} {doctorReg.Employee.LastName}"
                        : string.Empty,
                    Specialization = doctorReg!.Employee.Doctor.Specialization,
                    RoomName = t.Room!.Name,

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
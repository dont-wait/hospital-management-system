using Domain.Entities.ScheduleTask;
public interface ITaskItemRepository
{
    List<TaskItem> GetAvailableTaskItemsForBooking(DateOnly? date, int? departmentId, Guid? doctorId);
    Task <TaskItem?> GetTaskItemBySlotTimeIdAsync(long slotTimeId);
    Task<TaskItem> CreateTaskItem(
        RequestTaskItemDTO requestTaskItemDTO, 
        List<RequestTaskRegistrationDTO> taskRegistrations,
        List<SlotTime> slotTimes
    );
    Task<List<TaskItem>> GetTaskItemByEmployeeId(Guid employeeId);
    Task<bool> CheckEmployeeScheduleExists(Guid employeeId, DateOnly date, TimeOnly startTime, TimeOnly endTime);
    Task<List<Guid>> CheckEmployeesScheduleExists(List<Guid> employeeIds, DateOnly date, TimeOnly startTime, TimeOnly endTime);
}
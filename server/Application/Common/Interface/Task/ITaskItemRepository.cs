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
}
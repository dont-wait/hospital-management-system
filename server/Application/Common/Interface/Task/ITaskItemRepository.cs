using Domain.Entities.ScheduleTask;
public interface ITaskItemRepository
{
    Task<List<TaskItem>> GetAvailableTaskItemsForBooking(DateOnly? date, int? departmentId, Guid? doctorId);
    Task <TaskItem?> GetTaskItemBySlotTimeIdAsync(long slotTimeId);
}
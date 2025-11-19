using Domain.Entities.ScheduleTask;
public interface ITaskItemRepository
{
    List<TaskItem> GetAvailableTaskItemsForBooking(DateOnly? date, int? departmentId, Guid? doctorId);
}
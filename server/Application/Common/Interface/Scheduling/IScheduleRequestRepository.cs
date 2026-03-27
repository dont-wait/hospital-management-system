using Domain.Entities.ScheduleTask;

namespace Application.Common.Interface.Scheduling;

public interface IScheduleRequestRepository
{
    Task<ScheduleRequest> AddAsync(ScheduleRequest request);
    Task<ScheduleRequest?> GetByIdAsync(long id);
    Task UpdateAsync(ScheduleRequest request);
    Task<List<ScheduleRequest>> GetByDepartmentIdAsync(int departmentId);
}

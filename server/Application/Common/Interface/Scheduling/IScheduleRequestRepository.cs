using Domain.Entities.ScheduleTask;

namespace Application.Common.Interface.Scheduling;

public interface IScheduleRequestRepository
{
    Task<ScheduleRequest> AddAsync(ScheduleRequest request);
    Task<ScheduleRequest?> GetByIdAsync(long id);
    Task UpdateAsync(ScheduleRequest request);
    Task<List<ScheduleRequest>> GetByDepartmentIdAsync(int departmentId);
    Task<(List<ScheduleRequest> Items, int TotalCount)> GetPagedByFilterAsync(
        int? departmentId = null,
        string? status = null,
        DateOnly? fromDate = null,
        DateOnly? toDate = null,
        int page = 1,
        int pageSize = 10);
}

using Application.Common.Utils;

namespace Application.Common.Interface.Scheduling;

public interface IAutoSchedulingBackgroundService
{
    ServiceResult<string> EnqueueAutoScheduling(long scheduleRequestId);
}

using Application.Common.Interface.Scheduling;
using Application.Common.Utils;
using Hangfire;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services.Hangfire;

public class AutoSchedulingBackgroundService : IAutoSchedulingBackgroundService
{
    private readonly IBackgroundJobClient _backgroundJobClient;
    private readonly ILogger<AutoSchedulingBackgroundService> _logger;

    public AutoSchedulingBackgroundService(
        IBackgroundJobClient backgroundJobClient,
        ILogger<AutoSchedulingBackgroundService> logger)
    {
        _backgroundJobClient = backgroundJobClient;
        _logger = logger;
    }

    public ServiceResult<string> EnqueueAutoScheduling(long scheduleRequestId)
    {
        try
        {
            var jobId = _backgroundJobClient.Enqueue<AutoSchedulingHangfireJob>(
                job => job.ExecuteAsync(scheduleRequestId));

            return ServiceResult<string>.Success(jobId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to enqueue auto scheduling job for request {RequestId}", scheduleRequestId);
            return ServiceResult<string>.Fail("Không thể đưa yêu cầu xếp lịch vào hàng đợi.");
        }
    }
}

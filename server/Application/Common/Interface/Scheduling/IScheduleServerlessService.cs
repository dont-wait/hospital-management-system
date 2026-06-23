using System.Text.Json;

namespace Application.Common.Interface.Scheduling;

public interface IScheduleServerlessService
{
    Task<JsonElement> RunAsync(object requestBody);

    Task<JsonElement> GetProgressAsync(string requestId);

    Task<JsonElement> GetScheduleAsync(string requestId);
}

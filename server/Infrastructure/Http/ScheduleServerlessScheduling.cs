using System.Net.Http.Json;
using System.Text.Json;
using Application.Common.Interface.Scheduling;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Http;

public class ScheduleServerlessService : IScheduleServerlessService
{
    private readonly HttpClient _http;
    private readonly ILogger<ScheduleServerlessService> _logger;

    public ScheduleServerlessService(HttpClient http, ILogger<ScheduleServerlessService> logger)
    {
        _http = http;
        _logger = logger;
    }

    public async Task<JsonElement> RunAsync(object requestBody)
    {
        var response = await _http.PostAsJsonAsync("run", requestBody);
        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync();
            _logger.LogWarning(
                "Serverless scheduling request failed. StatusCode: {StatusCode}, Body: {ErrorBody}",
                (int)response.StatusCode,
                errorBody);

            throw new HttpRequestException(
                $"Response status code does not indicate success: {(int)response.StatusCode} ({response.StatusCode})."
            );
        }
        return await response.Content.ReadFromJsonAsync<JsonElement>();
    }

    public async Task<JsonElement> GetProgressAsync(string requestId)
    {
        var response = await _http.GetAsync($"progress/{requestId}");
        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException(
                $"Response status code does not indicate success: {(int)response.StatusCode} ({response.StatusCode}). Content: {errorBody}"
            );
        }
        return await response.Content.ReadFromJsonAsync<JsonElement>();
    }

    public async Task<JsonElement> GetScheduleAsync(string requestId)
    {
        var response = await _http.GetAsync($"jobs/{requestId}/schedule");
        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException(
                $"Response status code does not indicate success: {(int)response.StatusCode} ({response.StatusCode}). Content: {errorBody}"
            );
        }
        return await response.Content.ReadFromJsonAsync<JsonElement>();
    }
}

using System.Net.Http.Json;
using System.Text.Json;
using Application.Common.Interface.Scheduling;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Http;

public class ScheduleServerlessService : IScheduleServerlessService
{
    private readonly HttpClient _http;
    private readonly ILogger<ScheduleServerlessService> _logger;
    private readonly string _runEndpoint;
    private readonly string _progressEndpointTemplate;
    private readonly string _scheduleEndpointTemplate;

    public ScheduleServerlessService(
        HttpClient http,
        ILogger<ScheduleServerlessService> logger,
        IConfiguration configuration)
    {
        _http = http;
        _logger = logger;
        _runEndpoint = configuration.GetValue<string>("ServerlessService:RunEndpoint")
            ?? "/run";
        _progressEndpointTemplate = configuration.GetValue<string>("ServerlessService:ProgressEndpointTemplate")
            ?? "/progress/{request_id}";
        _scheduleEndpointTemplate = configuration.GetValue<string>("ServerlessService:ScheduleEndpointTemplate")
            ?? "/jobs/{request_id}/schedule";
    }

    public async Task<JsonElement> RunAsync(object requestBody)
    {
        var response = await _http.PostAsJsonAsync(_runEndpoint, requestBody);
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
        var endpoint = _progressEndpointTemplate.Replace("{request_id}", requestId);
        var response = await _http.GetAsync(endpoint);
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
        var endpoint = _scheduleEndpointTemplate.Replace("{request_id}", requestId);
        var response = await _http.GetAsync(endpoint);
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

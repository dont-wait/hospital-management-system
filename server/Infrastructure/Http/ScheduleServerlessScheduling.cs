using System.Net.Http.Json;
using System.Text.Json;

namespace Infrastructure.Http;

public class ScheduleServerlessService
{
    private readonly HttpClient _http;

    public ScheduleServerlessService(HttpClient http)
    {
        _http = http;
    }

    public async Task<JsonElement> RunAsync(object requestBody)
    {
        var response = await _http.PostAsJsonAsync("run", requestBody);
        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException(
                $"Response status code does not indicate success: {(int)response.StatusCode} ({response.StatusCode}). Content: {errorBody}"
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

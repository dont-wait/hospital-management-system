using System.Net.Http.Json;
using System.Text.Json;

namespace Infrastructure.Http;

public class ScheduleServerlessService
{
    private readonly HttpClient _http;

    public ScheduleServerlessService(IHttpClientFactory factory)
    {
        _http = factory.CreateClient("ServerlessScheduling");
    }

    public async Task<JsonElement> RunAsync(object requestBody)
    {
        var response = await _http.PostAsJsonAsync("/run", requestBody);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<JsonElement>();
    }

    public async Task<JsonElement> GetProgressAsync(string requestId)
    {
        var response = await _http.GetAsync($"/progress/{requestId}");
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<JsonElement>();
    }

    public async Task<JsonElement> GetScheduleAsync(string requestId)
    {
        var response = await _http.GetAsync($"/jobs/{requestId}/schedule");
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<JsonElement>();
    }
}

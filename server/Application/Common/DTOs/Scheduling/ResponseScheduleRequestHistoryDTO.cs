using System.Text.Json.Serialization;

public class ResponseScheduleRequestHistoryItemDTO
{
    [JsonPropertyName("id")]
    public long Id { get; set; }

    [JsonPropertyName("department_id")]
    public int DepartmentId { get; set; }

    [JsonPropertyName("department_name")]
    public string DepartmentName { get; set; } = string.Empty;

    [JsonPropertyName("requested_by")]
    public Guid RequestedBy { get; set; }

    [JsonPropertyName("requested_by_name")]
    public string RequestedByName { get; set; } = string.Empty;

    [JsonPropertyName("status")]
    public string Status { get; set; } = string.Empty;

    [JsonPropertyName("start_date")]
    public string StartDate { get; set; } = string.Empty;

    [JsonPropertyName("num_days")]
    public int NumDays { get; set; }

    [JsonPropertyName("progress_percent")]
    public int ProgressPercent { get; set; }

    [JsonPropertyName("serverless_request_id")]
    public string? ServerlessRequestId { get; set; }

    [JsonPropertyName("error_message")]
    public string? ErrorMessage { get; set; }

    [JsonPropertyName("created_at")]
    public DateTimeOffset CreatedAt { get; set; }
}

public class ResponseScheduleRequestHistoryDTO
{
    [JsonPropertyName("items")]
    public List<ResponseScheduleRequestHistoryItemDTO> Items { get; set; } = [];

    [JsonPropertyName("total")]
    public int Total { get; set; }

    [JsonPropertyName("page")]
    public int Page { get; set; }

    [JsonPropertyName("page_size")]
    public int PageSize { get; set; }
}

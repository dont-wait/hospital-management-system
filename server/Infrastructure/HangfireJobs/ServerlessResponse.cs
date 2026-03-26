using System.Text.Json.Serialization;

namespace Infrastructure.HangfireJobs;

public class ServerlessGenerateResponse
{
    [JsonPropertyName("request_id")]
    public string RequestId { get; set; } = string.Empty;

    [JsonPropertyName("status")]
    public string Status { get; set; } = "queued";

    [JsonPropertyName("progress_percent")]
    public double ProgressPercent { get; set; }

    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;
}

public class ServerlessProgressResponse
{
    [JsonPropertyName("request_id")]
    public string RequestId { get; set; } = string.Empty;

    [JsonPropertyName("status")]
    public string Status { get; set; } = string.Empty;

    [JsonPropertyName("progress_percent")]
    public double ProgressPercent { get; set; }

    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;

    [JsonPropertyName("result")]
    public ServerlessScheduleResult? Result { get; set; }

    [JsonPropertyName("error")]
    public string? Error { get; set; }
}

public class ServerlessScheduleResult
{
    [JsonPropertyName("selected_option_id")]
    public string? SelectedOptionId { get; set; }

    [JsonPropertyName("selected_schedule")]
    public ServerlessSchedule? SelectedSchedule { get; set; }
}

public class ServerlessSchedule
{
    [JsonPropertyName("start_date")]
    public string StartDate { get; set; } = string.Empty;

    [JsonPropertyName("num_days")]
    public int NumDays { get; set; }

    [JsonPropertyName("required_doctors_per_shift")]
    public int RequiredDoctorsPerShift { get; set; }

    [JsonPropertyName("shifts_per_day")]
    public int ShiftsPerDay { get; set; }

    [JsonPropertyName("assignments")]
    public List<ServerlessAssignment> Assignments { get; set; } = [];
}

public class ServerlessAssignment
{
    [JsonPropertyName("date")]
    public DateOnly Date { get; set; }

    [JsonPropertyName("shift")]
    public string Shift { get; set; } = string.Empty;

    [JsonPropertyName("start_time")]
    public TimeOnly StartTime { get; set; }

    [JsonPropertyName("end_time")]
    public TimeOnly EndTime { get; set; }

    [JsonPropertyName("doctor_ids")]
    public List<string> DoctorIds { get; set; } = [];
}
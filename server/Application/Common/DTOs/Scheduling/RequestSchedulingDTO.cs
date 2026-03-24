using System.Text.Json.Serialization;

public class RequestSchedulingDTO
{
    [JsonPropertyName("start_date")]
    public DateOnly StartDate { get; set; }

    [JsonPropertyName("num_days")]
    public int NumDays { get; set; }

    [JsonPropertyName("max_weekly_hours_per_doctor")]
    public int MaxWeeklyHoursPerDoctor { get; set; }

    [JsonPropertyName("max_days_off_per_doctor")]
    public int MaxDaysOffPerDoctor { get; set; }

    [JsonPropertyName("required_doctors_per_shift")]
    public int RequiredDoctorsPerShift { get; set; }

    [JsonPropertyName("shifts_per_day")]
    public int ShiftsPerDay { get; set; }

    [JsonPropertyName("doctors")]
    public List<RequestDoctorSchedulingDTO> Doctors { get; set; } = [];
}


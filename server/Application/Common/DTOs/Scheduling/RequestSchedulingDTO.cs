using System.Text.Json.Serialization;

public class RequestSchedulingDTO
{
    [JsonPropertyName("start_date")]
    public string StartDate { get; set; } = default!;

    [JsonPropertyName("num_days")]
    public int NumDays { get; set; }

    [JsonPropertyName("max_weekly_hours_per_doctor")]
    public int MaxWeeklyHoursPerDoctor { get; set; }

    [JsonPropertyName("max_days_off_per_doctor")]
    public int MaxDaysOffPerDoctor { get; set; }

    [JsonPropertyName("rooms_per_shift")]
    public int RoomsPerShift { get; set; }

    [JsonPropertyName("doctors_per_room")]
    public int DoctorsPerRoom { get; set; }

    [JsonPropertyName("shifts_per_day")]
    public int ShiftsPerDay { get; set; }

    [JsonPropertyName("doctors")]
    public List<RequestDoctorSchedulingDTO> Doctors { get; set; } = [];
}

public class RequestDoctorSchedulingDTO
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = default!;

    [JsonPropertyName("name")]
    public string Name { get; set; } = default!;

    [JsonPropertyName("experiences")]
    public int Experiences { get; set; }

    [JsonPropertyName("department_id")]
    public string DepartmentId { get; set; } = default!;

    [JsonPropertyName("specialization")]
    public string Specialization { get; set; } = default!;

    [JsonPropertyName("days_off")]
    public List<DateOnly> DaysOff { get; set; } = [];

    [JsonPropertyName("preferred_extra_days")]
    public List<DateOnly> PreferredExtraDays { get; set; } = [];

    [JsonPropertyName("has_valid_license")]
    public Boolean HasValidLicense { get; set; }

    [JsonPropertyName("is_intern")]
    public Boolean IsIntern { get; set; }

}


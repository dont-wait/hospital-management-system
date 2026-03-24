using System.Text.Json.Serialization;
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
}


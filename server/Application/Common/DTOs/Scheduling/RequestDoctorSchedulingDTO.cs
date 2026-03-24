public class RequestDoctorSchedulingDTO
{
    public string Id { get; set; } = default!;
    public string Name { get; set; } = default!;
    public int Experiences { get; set; }
    public string DepartmentId { get; set; } = default!;
    public string Specialization { get; set; } = default!;
    public List<DateOnly> DaysOff { get; set; } = [];
    public List<DateOnly> PreferredExtraDays { get; set; } = [];
}


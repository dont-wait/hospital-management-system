public class RequestSchedulingDTO
{
    public DateOnly StartDate { get; set; }
    public int NumDays { get; set; }
    public int MaxWeeklyHoursPerDoctor { get; set; }
    public int MaxDaysOffPerDoctor { get; set; }
    public int RequiredDoctorsPerShift { get; set; }
    public int ShiftsPerDay { get; set; }
    public List<RequestDoctorSchedulingDTO> Doctors { get; set; } = [];
}


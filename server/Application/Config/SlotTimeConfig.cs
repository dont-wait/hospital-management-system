namespace Application.Config.SlotTime;
public class SlotTimeConfig
{
    public int DefaultMaxAppointments { get; set; }
    public int SlotDurationMinutes { get; set; }
    public WorkShiftConfig MorningShift { get; set; } = new();
    public WorkShiftConfig AfternoonShift { get; set; } = new();
}

public class WorkShiftConfig
{
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
}
public class ResponseSlotTimeDTO
{
    public long SlotId { get; set; }
    public string SlotStatus { get; set; } = string.Empty;
    public TimeOnly SlotStartTime { get; set; }
    public TimeOnly SlotEndTime { get; set; }
}
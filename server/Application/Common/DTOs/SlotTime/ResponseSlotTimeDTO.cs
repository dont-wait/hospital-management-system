namespace Application.Common.DTOs.SlotTime;

public class ResponseSlotTimeDTO
{
    public long SlotId { get; set;}
    public string SlotStatus { get; set; } = string.Empty;
    public DateTimeOffset SlotStartTime { get; set; }
    public DateTimeOffset SlotEndTime { get; set; }
}
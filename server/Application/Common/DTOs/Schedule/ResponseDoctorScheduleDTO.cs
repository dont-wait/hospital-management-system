using Application.Common.DTOs.SlotTime;

namespace Application.Common.DTOs.Schedule;
public class ResponseDoctorScheduleDTO
{
    public long ScheduleId { get; set; }
    public DateTimeOffset StartTime { get; set; }
    public DateTimeOffset EndTime { get; set; }
    public string ScheduleStatus { get; set; } = null!;
    public ResponseDoctorDTO Doctor { get; set; } = null!;
    public string RoomName { get; set; } = null!;
    public List<ResponseSlotTimeDTO> SlotTimes { get; set; } = new List<ResponseSlotTimeDTO>();
}
public class ResponseTaskItemDTO
{
    public long ScheduleId { get; set;} //TaskId
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string ScheduleStatus { get; set; } = string.Empty; //TaskStatus
    public Guid DoctorId { get; set;}
    public Guid FullName { get; set;}
    public string Specialization { get; set;} = string.Empty;
    public List<ResponseSlotTimeDTO> Slots { get; set;} = new List<ResponseSlotTimeDTO>();
}
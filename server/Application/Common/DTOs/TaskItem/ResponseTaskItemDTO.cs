public class ResponseTaskItemDTO
{
    public long ScheduleId { get; set;} //TaskId
    public string Name { get; set;} = string.Empty;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string ScheduleStatus { get; set; } = string.Empty; //TaskStatus
    public string Description { get; set;} = string.Empty;
    public Guid DoctorId { get; set;}
    public int DepartmentId { get; set;}
    public string DepartmentName { get; set;} = string.Empty;
    public string DepartmentDescription { get; set;} = string.Empty;
    public string RoomName { get; set; } = string.Empty;
    public string? FullName { get; set;}
    public string Specialization { get; set;} = string.Empty;
    public List<ResponseTaskRegistrationDTO> TaskRegistrations { get; set; } = new List<ResponseTaskRegistrationDTO>();
    public List<ResponseSlotTimeDTO> Slots { get; set;} = new List<ResponseSlotTimeDTO>();
}
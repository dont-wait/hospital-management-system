public class ResponseAvailableAppointment
{
    public DateOnly Date { get; set; }
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; } = string.Empty;
    public string DepartmentDescription { get; set; } = string.Empty;
    public double PriceOfService { get; set; }
    public List<ResponseTaskItemDTO> Schedules { get; set; } = new List<ResponseTaskItemDTO>();
}

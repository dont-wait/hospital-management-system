public class ResponseDeparmentRevenueStatisticsDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int TotalAppointments { get; set; }
    public decimal Revenue { get; set; }
    public double? RevenueGrowthPercentage { get; set; }
}

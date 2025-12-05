public class ResponseDeparmentRevenueStatisticsDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int TotalAppointments { get; set; }
    public decimal Revenue { get; set; }
    public decimal? RevenueGrowthPercentage { get; set; }
}

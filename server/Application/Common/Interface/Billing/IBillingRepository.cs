public interface IBillingRepository
{
    Task<Billing>  CreateBillingAsync(Billing billing);
    Task<Billing?> GetBillingByIdAsync(long billingId);
    Task<List<ResponseDeparmentRevenueStatisticsDTO>> GetDepartmentRevenueStatisticsAsync(string type, DateTime? date);
}
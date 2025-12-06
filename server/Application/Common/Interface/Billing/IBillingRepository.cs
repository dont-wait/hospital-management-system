using Application.Common.DTOs;
using Application.Common.DTOs.Billing;

public interface IBillingRepository
{
    Task<Billing> CreateBillingAsync(Billing billing);
    Task<Billing?> GetBillingByIdAsync(long billingId);
    Task<PaginatedResult<Billing>> GetBillingsAsync(string? status, Guid? patientId, Guid? doctorId, int page, int size);
    Task<List<ResponseDeparmentRevenueStatisticsDTO>> GetDepartmentRevenueStatisticsAsync(string type, DateTime? fromDate, DateTime? toDate); 
    Task<List<ResponseLatestTransactionDTO>> GetLatestTransactionsAsync(int page, int count, DateTime? fromDate, DateTime? toDate);
    Task<List<ResponseRevenueDTO>> GetAllRevenueAsync(string timeRange, DateTime? referenceDate, DateTime? toDate);
    Task<List<ResponseRevenueByCategoryDTO>> GetRevenueByCategoryAsync(string timeRange, DateTime? fromDate, DateTime? toDate);
}
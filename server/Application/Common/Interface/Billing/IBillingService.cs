using Application.Common.DTOs;
using Application.Common.DTOs.Billing;
using Application.Common.Utils;

public interface IBillingService
{
    public Task<ServiceResult<List<ResponseLatestTransactionDTO>>> GetLatestTransactionsAsync(int page, int count, DateTime? fromDate, DateTime? toDate);
    Task<ServiceResult<ResponseBillingDTO>> GetBillingByIdAsync(long billingId);
    Task<ServiceResult<PaginatedResult<ResponseBillingDTO>>> GetBillingsAsync(string? status, Guid? patientId, Guid? doctorId, int page, int size);
    Task<ServiceResult<string>> CreateBillingAsync(RequestBillingDTO createBillingDto);
}
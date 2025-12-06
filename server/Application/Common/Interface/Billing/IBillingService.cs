using Application.Common.DTOs;
using Application.Common.DTOs.Billing;
using Application.Common.Utils;

public interface IBillingService
{
    Task<ServiceResult<ResponseBillingDTO>> GetBillingByIdAsync(long billingId);
    Task<ServiceResult<PaginatedResult<ResponseBillingDTO>>> GetBillingsAsync(string? status, Guid? patientId, Guid? doctorId, int page, int size);
    Task<ServiceResult<string>> CreateBillingAsync(RequestBillingDTO createBillingDto);
}
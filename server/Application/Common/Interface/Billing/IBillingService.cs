using Application.Common.DTOs.Billing;
using Application.Common.Utils;

namespace Application.Services.Billing;
public interface IBillingService
{
    Task<ServiceResult<ResponseBillingDTO>> GetBillingByIdAsync(long billingId);
    Task<ServiceResult<List<ResponseBillingDTO>>> GetBillingsAsync(string? status, Guid? patientId, Guid? doctorId, int page, int size);
    Task<ServiceResult<string>> CreateBillingAsync(RequestBillingDTO createBillingDto);
}
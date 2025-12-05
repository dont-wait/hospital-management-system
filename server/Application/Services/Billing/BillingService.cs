using Application.Common.DTOs.Billing;
using Application.Common.Utils;

namespace Application.Services.Billing;
public class BillingService : IBillingService
{
    private readonly IBillingRepository _billingRepository;
    public BillingService(IBillingRepository billingRepository)
    {
        _billingRepository = billingRepository;
    }

    public Task<ServiceResult<ResponseBillingDTO>> GetBillingByIdAsync(long billingId)
    {
        throw new NotImplementedException();
    }
    public Task<ServiceResult<List<ResponseBillingDTO>>> GetBillingsAsync(string? status, Guid? patientId, Guid? doctorId, int page, int size)
    {
        throw new NotImplementedException();
    }
    public Task<ServiceResult<string>> CreateBillingAsync(RequestBillingDTO createBillingDto)
    {
        throw new NotImplementedException();
    }
}
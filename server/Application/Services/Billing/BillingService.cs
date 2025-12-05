using Application.Common.DTOs.Billing;
using Application.Common.Utils;


public class BillingService : IBillingService
{
    private readonly IBillingRepository _billingRepository;
    
    public BillingService(IBillingRepository billingRepository)
    {
        _billingRepository = billingRepository;
    }

    public async Task<ServiceResult<ResponseBillingDTO>> GetBillingByIdAsync(long billingId)
    {
        var billing = await _billingRepository.GetBillingByIdAsync(billingId);
        if (billing == null)
            return ServiceResult<ResponseBillingDTO>.Fail("Không tìm thấy hóa đơn");

        var response = new ResponseBillingDTO
        {
            Id = billing.Id,
            DiscountAmount = (float)billing.DiscountAmount,
            PaymentAmount = (float)billing.PaymentAmount,
            PaymentMethod = billing.PaymentMethod,
            BillingStatus = billing.BillingStatus
        };
        
        return ServiceResult<ResponseBillingDTO>.Success(response);
    }
    
    public async Task<ServiceResult<List<ResponseBillingDTO>>> GetBillingsAsync(
        string? status, 
        Guid? patientId, 
        Guid? doctorId, 
        int page, 
        int size)
    {
        var billings = await _billingRepository.GetBillingsAsync(status, patientId, doctorId, page, size);
        
        var response = billings.Select(b => new ResponseBillingDTO
        {
            Id = b.Id,
            DiscountAmount = (float)b.DiscountAmount,
            PaymentAmount = (float)b.PaymentAmount,
            PaymentMethod = b.PaymentMethod,
            BillingStatus = b.BillingStatus
        }).ToList();
        
        return ServiceResult<List<ResponseBillingDTO>>.Success(response);
    }
    
    public async Task<ServiceResult<string>> CreateBillingAsync(RequestBillingDTO createBillingDto)
    {
        var billing = new Billing
        {
            DiscountAmount = createBillingDto.DiscountAmount,
            PaymentAmount = createBillingDto.PaymentAmount,
            PaymentMethod = createBillingDto.PaymentMethod,
            BillingStatus = createBillingDto.BillingStatus
        };

        var created = await _billingRepository.CreateBillingAsync(billing);
        return ServiceResult<string>.Success($"Tạo hóa đơn thành công với ID: {created.Id}");
    }
}
using Application.Common.DTOs;
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
            BillingStatus = billing.BillingStatus,
            CreatedAt = billing.CreatedAt,
            ServiceName = billing.Appointment!.Service!.Name
        };
        
        return ServiceResult<ResponseBillingDTO>.Success(response);
    }
    
    public async Task<ServiceResult<PaginatedResult<ResponseBillingDTO>>> GetBillingsAsync(
        string? status, 
        Guid? patientId, 
        Guid? doctorId, 
        int page, 
        int size)
    {
        var paginatedResult = await _billingRepository.GetBillingsAsync(status, patientId, doctorId, page, size);
        
        var billingDtos = paginatedResult.Items.Select(b => new ResponseBillingDTO
        {
            Id = b.Id,
            DiscountAmount = (float)b.DiscountAmount,
            PaymentAmount = (float)b.PaymentAmount,
            PaymentMethod = b.PaymentMethod,
            BillingStatus = b.BillingStatus
            
        }).ToList();
        
        var response = new PaginatedResult<ResponseBillingDTO>
        {
            Items = billingDtos,
            TotalPages = paginatedResult.TotalPages,
            CurrentPage = paginatedResult.CurrentPage,
            PageSize = paginatedResult.PageSize,
            TotalRecords = paginatedResult.TotalRecords
        };
        
        return ServiceResult<PaginatedResult<ResponseBillingDTO>>.Success(response);
    }
    
    public async Task<ServiceResult<string>> CreateBillingAsync(RequestBillingDTO createBillingDto)
    {
        var billing = new Billing
        {
            DiscountAmount = createBillingDto.DiscountAmount,
            PaymentAmount = createBillingDto.PaymentAmount,
            PaymentMethod = createBillingDto.PaymentMethod,
            BillingStatus = createBillingDto.BillingStatus,
            
        };

        var created = await _billingRepository.CreateBillingAsync(billing);
        return ServiceResult<string>.Success($"Tạo hóa đơn thành công với ID: {created.Id}");
    }
}
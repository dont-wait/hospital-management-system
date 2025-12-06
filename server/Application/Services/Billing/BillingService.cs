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
            BillingStatus = billing.BillingStatus
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
            BillingStatus = createBillingDto.BillingStatus
        };

        var created = await _billingRepository.CreateBillingAsync(billing);
        return ServiceResult<string>.Success($"Tạo hóa đơn thành công với ID: {created.Id}");
    }

    public async Task<ServiceResult<List<ResponseLatestTransactionDTO>>> GetLatestTransactionsAsync(int page, int count, DateTime? fromDate, DateTime? toDate)
    {
        try
        {
            var transactions = await _billingRepository.GetLatestTransactionsAsync(page, count, fromDate, toDate);
            return ServiceResult<List<ResponseLatestTransactionDTO>>.Success(transactions);   
        } catch(Exception ex)
        {
            Console.WriteLine("Error fetching latest transactions: " + ex.Message);
            return ServiceResult<List<ResponseLatestTransactionDTO>>.Fail("Lỗi khi lấy giao dịch mới nhất");
        }
    }

    public async Task<ServiceResult<List<ResponseRevenueDTO>>> GetAllRevenueAsync(string timeRange, DateTime? referenceDate, DateTime? toDate)
    {
        try
        {
            // Validate timeRange
            var validTimeRanges = new[] { "day", "week", "month", "year", "range" };
            if (!validTimeRanges.Contains(timeRange.ToLower()))
            {
                return ServiceResult<List<ResponseRevenueDTO>>.Fail("Khoảng thời gian không hợp lệ. Giá trị hợp lệ: day, week, month, year, range");
            }

            var revenues = await _billingRepository.GetAllRevenueAsync(timeRange, referenceDate, toDate);
            return ServiceResult<List<ResponseRevenueDTO>>.Success(revenues);
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error fetching revenues: " + ex.Message);
            return ServiceResult<List<ResponseRevenueDTO>>.Fail("Lỗi khi lấy dữ liệu doanh thu");
        }
    }
}
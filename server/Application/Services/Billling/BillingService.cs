using Application.Common.Utils;

public class BillingService : IBillingService
{
    private readonly IBillingRepository _billingRepository;

    public BillingService(IBillingRepository billingRepository)
    {
        _billingRepository = billingRepository;
    }

    public async Task<ServiceResult<List<ResponseLatestTransactionDTO>>> GetLatestTransactionsAsync(int count)
    {
        try
        {
            List<ResponseLatestTransactionDTO>? result = await _billingRepository.GetLatestTransactionsAsync(count);

            return ServiceResult<List<ResponseLatestTransactionDTO>>.Success(result);
        } catch
        {
            return ServiceResult<List<ResponseLatestTransactionDTO>>.Fail("Lỗi khi lấy danh sách giao dịch gần đây.");
        }
    }
}
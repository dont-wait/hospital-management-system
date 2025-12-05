using Application.Common.Utils;

public interface IBillingService
{
    public Task<ServiceResult<List<ResponseLatestTransactionDTO>>> GetLatestTransactionsAsync(int count);
}
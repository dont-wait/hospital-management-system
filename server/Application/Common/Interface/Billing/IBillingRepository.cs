public interface IBillingRepository
{
    Task<Billing>  CreateBillingAsync(Billing billing);
    Task<Billing?> GetBillingByIdAsync(long billingId);
}
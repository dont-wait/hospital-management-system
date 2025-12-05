public interface IBillingRepository
{
    Task<Billing> CreateBillingAsync(Billing billing);
    Task<Billing?> GetBillingByIdAsync(long billingId);
    Task<List<Billing>> GetBillingsAsync(string? status, Guid? patientId, Guid? doctorId, int page, int size);
}
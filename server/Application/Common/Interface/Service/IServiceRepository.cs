public interface IServiceRepository
{
    Task<Service?> GetServiceByIdAsync(int serviceId);
    Task<string> UpdateBillingAmountAsync(long appointmentId);
}

public class Billing : BaseEntity
{
    public long Id { get; set; }
    public virtual Appointment? Appointment { get; set; }
    public double DiscountAmount { get; set; }
    public double PaymentAmount { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string BillingStatus { get; set; } = BillingStatusEnum.UnPaid.ToString();
    
}
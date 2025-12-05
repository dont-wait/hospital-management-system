namespace Application.Common.DTOs.Billing;
public class ResponseBillingDTO
{
    public long Id { get; set; }
    public float DiscountAmount { get; set; }
    public float PaymentAmount { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string BillingStatus { get; set; } = string.Empty;
}
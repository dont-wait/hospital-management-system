using System.ComponentModel.DataAnnotations;

public class Service : BaseEntity
{
    [Key]
    public int Id { get; set; }
    [Required]
    [StringLength(150)]
    public string Name { get; set; } = string.Empty;
    public double InsurancePrice { get; set; } //Theo BHYT
    public double SelfPrice { get; set; } //Theo dich vu
    public double OnDemandPrice { get; set; } //KHam ngoai gio
    
    [StringLength(200)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public string ServiceType { get; set; } = string.Empty; //ServiceTypeEnum      
    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}
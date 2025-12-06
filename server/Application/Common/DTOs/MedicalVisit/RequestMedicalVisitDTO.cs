using System.ComponentModel.DataAnnotations;
public class RequestMedicalVisitDTO
{
    [Required]
    public string Symptoms { get; set; } = string.Empty;
    
    [Required]
    public string PhysicalExamination { get; set; } = string.Empty;
    
    [Required]
    public string Diagnosis { get; set; } = string.Empty;
    
    [Required]
    public string Treatment { get; set; } = string.Empty;
    public string Note { get; set; } = string.Empty;
    public string ImageResult { get; set; } = string.Empty;

    [Required]
    public long AppointmentId { get; set; }
}
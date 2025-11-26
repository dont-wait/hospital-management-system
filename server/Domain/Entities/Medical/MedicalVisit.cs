public class MedicalVisit : BaseEntity
{
    public long Id { get; set; }
    public string Symptoms { get; set; } = string.Empty;
    public string PhysicalExamination { get; set; } = string.Empty;
    public string Diagnosis { get; set; } = string.Empty;
    public string Treatment { get; set; } = string.Empty;
    public string Note { get; set; } = string.Empty;
    public string ImageResult { get; set; } = string.Empty;

    public long AppointmentId { get; set; }
    public virtual Appointment? Appointment { get; set; }
    
    public Guid PatientId { get; set; }
    public virtual Patient? Patient { get; set; }
}
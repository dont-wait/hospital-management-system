public class ResponsePrescriptionDTO
{
    public long Id { get; set; }

    public string Instructions { get; set; } = string.Empty;

    public string Note { get; set; } = string.Empty;

    public virtual MedicalVisit MedicalVisit { get; set; } = null!;

    public List<ResponsePrescriptionDetailDTO> PrescriptionDetails { get; set; } = null!;
}
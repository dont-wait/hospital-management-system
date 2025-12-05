public class ResponsePrescriptionDetailDTO
{
    public long Id { get; set; }    
    
    public long Dosage { get; set; }

    public int Frequency { get; set; }

    public int Duration { get; set; }

    public string Route { get; set; } = null!;

    public int Quantity { get; set; }
}
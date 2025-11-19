using System.ComponentModel.DataAnnotations;

public class Room
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public int Capacity { get; set; }
    public int DepartmentId { get; set; }
    public virtual Department Department { get; set; } = null!;
    
}
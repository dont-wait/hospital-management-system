using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;
using Domain.Entities.ScheduleTask;

public class Department
{
    [Key]
    public int Id { get; set; }
    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Location { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public ICollection<Room> Rooms { get; set; } = new List<Room>();

    public ICollection<TaskItem> TaskItems { get; set; } = new List<TaskItem>();
    
    public ICollection<Employee> Employees { get; set; } = new List<Employee>();
    
}
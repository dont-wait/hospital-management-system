using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("roles")]
public class Roles : BaseEntity
{
    [Key]
    [StringLength(20)]
    public string RoleId { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
    public ICollection<Patient> Patients { get; set; } = new List<Patient>();
    public ICollection<Employee> Employees { get; set; } = new List<Employee>();
}
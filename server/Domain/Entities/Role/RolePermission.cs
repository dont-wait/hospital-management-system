using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("role_permission")]
public class RolePermission : BaseEntity
{
    public string RoleId { get; set; } = string.Empty;
    public Roles Role { get; set; } = null!;

    public string PermissionId { get; set; } = string.Empty;
    public Permission Permission { get; set; } = null!;
}
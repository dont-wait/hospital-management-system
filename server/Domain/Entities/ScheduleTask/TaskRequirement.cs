using System.ComponentModel.DataAnnotations;
using Domain.Enums;

namespace Domain.Entities.ScheduleTask;

public class TaskRequirement : BaseEntity
{
    [Key]
    public long Id { get; set; }
    
    public long TaskId { get; set; }
    public virtual TaskItem Task { get; set; } = null!;
    
    [MaxLength(100)]
    public string? RequiredSpecialization { get; set; }  //Cho phep Khong yeu cau chuyen khoa

    [Required]
    [Range(1, 30)]
    public int RequiredEmployees { get; set; }
    
    [Required]
    [Range(0, 30)]
    public int RegisteredEmployees { get; set; } = 0;

    [Required]
    public string RoleId { get; set; } = RoleEnum.doctor.ToString();       // Phân công cho vai trò nào: doctor, nurse, technician, ...

    public int MinExperienceYears { get; set; }          // ví dụ 5
    
}
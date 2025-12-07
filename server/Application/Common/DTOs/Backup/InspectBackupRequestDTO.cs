namespace Application.Common.DTOs.Backup;

/// <summary>
/// Request DTO để inspect một hoặc nhiều backup files
/// </summary>
public class InspectBackupRequestDTO
{
    /// <summary>
    /// Đường dẫn thư mục chứa backup files (Linux path format)
    /// </summary>
    public string BackupPath { get; set; } = string.Empty;

    /// <summary>
    /// Danh sách tên file backup cần inspect
    /// </summary>
    public List<string> FileNames { get; set; } = new List<string>();
}

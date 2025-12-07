namespace Application.Common.DTOs.Backup;

/// <summary>
/// Request DTO để restore database
/// </summary>
public class RestoreDatabaseRequestDTO
{
    /// <summary>
    /// Tên database đích (sẽ restore vào database này)
    /// </summary>
    public string DatabaseName { get; set; } = string.Empty;

    /// <summary>
    /// Đường dẫn thư mục chứa backup files (Linux path format)
    /// </summary>
    public string BackupPath { get; set; } = string.Empty;

    /// <summary>
    /// Danh sách tên file backup (backend sẽ tự sắp xếp đúng thứ tự)
    /// </summary>
    public List<string> BackupFiles { get; set; } = new List<string>();

    /// <summary>
    /// Thời điểm dừng restore (point-in-time recovery)
    /// Null = restore toàn bộ
    /// </summary>
    public DateTime? StopAt { get; set; }

    /// <summary>
    /// Kết thúc restore với RECOVERY (true) hay giữ NORECOVERY (false)
    /// </summary>
    public bool WithRecovery { get; set; } = true;

    /// <summary>
    /// Cho phép ghi đè database đang tồn tại (REPLACE)
    /// </summary>
    public bool ForceReplace { get; set; } = true;
}

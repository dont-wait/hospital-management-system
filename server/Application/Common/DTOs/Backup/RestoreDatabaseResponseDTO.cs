namespace Application.Common.DTOs.Backup;

/// <summary>
/// Response DTO cho restore operation
/// </summary>
public class RestoreDatabaseResponseDTO
{
    /// <summary>
    /// Tên database đã restore
    /// </summary>
    public string DatabaseName { get; set; } = string.Empty;

    /// <summary>
    /// Thời gian bắt đầu restore
    /// </summary>
    public DateTime StartTime { get; set; }

    /// <summary>
    /// Thời gian kết thúc restore
    /// </summary>
    public DateTime EndTime { get; set; }

    /// <summary>
    /// Tổng thời gian restore (giây)
    /// </summary>
    public double DurationInSeconds { get; set; }

    /// <summary>
    /// Các bước restore đã thực hiện
    /// </summary>
    public List<RestoreStepDTO> Steps { get; set; } = new List<RestoreStepDTO>();

    /// <summary>
    /// Status: SUCCESS, FAILED, PARTIAL
    /// </summary>
    public string Status { get; set; } = string.Empty;

    /// <summary>
    /// Message chi tiết
    /// </summary>
    public string Message { get; set; } = string.Empty;
}

/// <summary>
/// Chi tiết một bước restore
/// </summary>
public class RestoreStepDTO
{
    /// <summary>
    /// Thứ tự bước (1, 2, 3...)
    /// </summary>
    public int StepNumber { get; set; }

    /// <summary>
    /// Loại restore: FULL, DIFF, LOG
    /// </summary>
    public string BackupType { get; set; } = string.Empty;

    /// <summary>
    /// Tên file backup
    /// </summary>
    public string FileName { get; set; } = string.Empty;

    /// <summary>
    /// Thời gian bắt đầu bước này
    /// </summary>
    public DateTime StartTime { get; set; }

    /// <summary>
    /// Thời gian kết thúc bước này
    /// </summary>
    public DateTime EndTime { get; set; }

    /// <summary>
    /// Status: SUCCESS, FAILED
    /// </summary>
    public string Status { get; set; } = string.Empty;

    /// <summary>
    /// Message của bước này
    /// </summary>
    public string Message { get; set; } = string.Empty;
}

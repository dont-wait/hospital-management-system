namespace Application.Common.DTOs.Backup;

/// <summary>
/// Response DTO cho inspect operation
/// </summary>
public class InspectBackupResponseDTO
{
    /// <summary>
    /// Danh sách metadata của các file backup
    /// </summary>
    public List<BackupFileMetadataDTO> Metadata { get; set; } = new List<BackupFileMetadataDTO>();

    /// <summary>
    /// Validation summary cho toàn bộ backup chain
    /// </summary>
    public BackupChainValidationDTO Validation { get; set; } = new BackupChainValidationDTO();
}

/// <summary>
/// Validation result cho backup chain
/// </summary>
public class BackupChainValidationDTO
{
    /// <summary>
    /// Có hợp lệ để restore không
    /// </summary>
    public bool IsValid { get; set; }

    /// <summary>
    /// FULL backup có trong chain không
    /// </summary>
    public bool HasFullBackup { get; set; }

    /// <summary>
    /// Thông tin về FULL backup (nếu có)
    /// </summary>
    public string? FullBackupFileName { get; set; }

    /// <summary>
    /// Có DIFF backup không
    /// </summary>
    public bool HasDifferentialBackup { get; set; }

    /// <summary>
    /// Thông tin về DIFF backup (nếu có)
    /// </summary>
    public string? DifferentialBackupFileName { get; set; }

    /// <summary>
    /// DIFF backup có match với FULL không
    /// </summary>
    public bool DifferentialMatchesBase { get; set; }

    /// <summary>
    /// Số lượng LOG backups
    /// </summary>
    public int LogBackupCount { get; set; }

    /// <summary>
    /// LOG chain có liên tục không
    /// </summary>
    public bool LogChainContinuous { get; set; }

    /// <summary>
    /// Danh sách errors
    /// </summary>
    public List<string> Errors { get; set; } = new List<string>();

    /// <summary>
    /// Danh sách warnings
    /// </summary>
    public List<string> Warnings { get; set; } = new List<string>();

    /// <summary>
    /// Thứ tự restore được recommend
    /// </summary>
    public List<string> RecommendedRestoreOrder { get; set; } = new List<string>();
}

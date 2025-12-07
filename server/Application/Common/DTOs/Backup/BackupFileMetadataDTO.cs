namespace Application.Common.DTOs.Backup;

/// <summary>
/// DTO chứa metadata từ RESTORE HEADERONLY
/// </summary>
public class BackupFileMetadataDTO
{
    /// <summary>
    /// Tên database trong backup
    /// </summary>
    public string DatabaseName { get; set; } = string.Empty;

    /// <summary>
    /// Loại backup: FULL (1), DIFF (5), LOG (2)
    /// </summary>
    public int BackupType { get; set; }

    /// <summary>
    /// Tên loại backup dạng text
    /// </summary>
    public string BackupTypeText { get; set; } = string.Empty; // FULL, DIFF, LOG

    /// <summary>
    /// Tên file backup
    /// </summary>
    public string FileName { get; set; } = string.Empty;

    /// <summary>
    /// LSN (Log Sequence Number) bắt đầu của backup này
    /// </summary>
    public decimal FirstLSN { get; set; }

    /// <summary>
    /// LSN cuối cùng của backup này
    /// </summary>
    public decimal LastLSN { get; set; }

    /// <summary>
    /// Database backup LSN - quan trọng để xác định FULL backup base
    /// </summary>
    public decimal DatabaseBackupLSN { get; set; }

    /// <summary>
    /// Differential Base LSN - dùng để match DIFF với FULL
    /// </summary>
    public decimal? DifferentialBaseLSN { get; set; }

    /// <summary>
    /// Checkpoint LSN
    /// </summary>
    public decimal CheckpointLSN { get; set; }

    /// <summary>
    /// Thời điểm backup bắt đầu
    /// </summary>
    public DateTime BackupStartDate { get; set; }

    /// <summary>
    /// Thời điểm backup kết thúc
    /// </summary>
    public DateTime BackupFinishDate { get; set; }

    /// <summary>
    /// Kích thước backup (bytes)
    /// </summary>
    public long BackupSize { get; set; }

    /// <summary>
    /// Có phải là compressed backup không
    /// </summary>
    public bool IsCompressed { get; set; }

    /// <summary>
    /// Position trong backup media set
    /// </summary>
    public int Position { get; set; }

    /// <summary>
    /// Có phải là copy-only backup không
    /// </summary>
    public bool IsCopyOnly { get; set; }

    /// <summary>
    /// Recovery model: FULL, SIMPLE, BULK_LOGGED
    /// </summary>
    public string RecoveryModel { get; set; } = string.Empty;

    /// <summary>
    /// Thông tin về software tạo backup
    /// </summary>
    public string SoftwareVersionMajor { get; set; } = string.Empty;

    /// <summary>
    /// Thứ tự trong restore chain (được tính sau khi sort)
    /// </summary>
    public int OrderInChain { get; set; }

    /// <summary>
    /// Validation errors (nếu có)
    /// </summary>
    public List<string> ValidationErrors { get; set; } = new List<string>();

    /// <summary>
    /// Có hợp lệ để restore không
    /// </summary>
    public bool IsValid => ValidationErrors.Count == 0;
}

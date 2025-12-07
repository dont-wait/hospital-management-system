using Application.Common.DTOs.Backup;

public interface IBackupRepository
{
    Task SaveBackupInfoAsync(RequestBackupInfo backupInfo);
    Task<List<ResponseBackupInfo>> GetAllRecentBackupsAsync();
    
    /// <summary>
    /// Inspect backup file metadata using RESTORE HEADERONLY
    /// </summary>
    Task<BackupFileMetadataDTO> InspectBackupFileAsync(string backupPath, string fileName);
    
    /// <summary>
    /// Execute restore database stored procedure
    /// </summary>
    Task<RestoreDatabaseResponseDTO> RestoreDatabaseAsync(
        string databaseName,
        string backupPath,
        string fullBackupFile,
        string? diffBackupFile,
        string? logBackupFiles,
        DateTime? stopAt,
        bool withRecovery,
        bool forceReplace
    );
}
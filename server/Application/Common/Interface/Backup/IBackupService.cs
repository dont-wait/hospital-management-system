using Application.Common.DTOs.Backup;
using Application.Common.Utils;

public interface IBackupService
{
    public Task<ServiceResult<string>> CreateBackupAsync(RequestBackupInfo backupInfo);
    public Task<ServiceResult<List<ResponseBackupInfo>>> GetAllRecentBackupsAsync();
    
    /// <summary>
    /// Inspect backup files và validate chain
    /// </summary>
    public Task<ServiceResult<InspectBackupResponseDTO>> InspectBackupFilesAsync(InspectBackupRequestDTO request);
    
    /// <summary>
    /// Restore database từ backup files
    /// </summary>
    public Task<ServiceResult<RestoreDatabaseResponseDTO>> RestoreDatabaseAsync(RestoreDatabaseRequestDTO request);
}
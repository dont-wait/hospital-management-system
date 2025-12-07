using Application.Common.Utils;

public interface IBackupService
{
    public Task<ServiceResult<string>> CreateBackupAsync(RequestBackupInfo backupInfo);
    public Task<ServiceResult<List<ResponseBackupInfo>>> GetAllRecentBackupsAsync();
}
public interface IBackupRepository
{
    Task SaveBackupInfoAsync(RequestBackupInfo backupInfo);
    Task<List<ResponseBackupInfo>> GetAllRecentBackupsAsync();
}
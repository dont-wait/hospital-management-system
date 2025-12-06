public interface IBackupRepository
{
    Task SaveBackupInfoAsync(RequestBackupInfo backupInfo);
}
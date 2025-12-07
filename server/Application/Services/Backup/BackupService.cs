using Application.Common.Utils;

public class BackupService : IBackupService
{
    public IBackupRepository _backupRepository;

    public BackupService(IBackupRepository backupRepository)
    {
        _backupRepository = backupRepository;
    }

    public async Task<ServiceResult<string>> CreateBackupAsync(RequestBackupInfo backupInfo)
    {
        try
        {
            if (string.IsNullOrEmpty(backupInfo.BackupType))
            {
                return ServiceResult<string>.Fail("Loại bản sao lưu không được để trống");
            }

            string type = backupInfo.BackupType.ToUpper();
            string[] validTypes = { "FULL", "DIFF", "LOG" };

            if (!validTypes.Contains(type))
            {
                return ServiceResult<string>.Fail("Loại bản sao lưu không hợp lệ");
            }

            await _backupRepository.SaveBackupInfoAsync(backupInfo);

            return ServiceResult<string>.Success(null!);
        } catch (Exception ex)
        {
            Console.WriteLine(ex);
            return ServiceResult<string>.Fail("Lỗi khi tạo bản sao lưu");
        }
    }

    public async Task<ServiceResult<List<ResponseBackupInfo>>> GetAllRecentBackupsAsync()
    {
        try
        {
            var backups = await _backupRepository.GetAllRecentBackupsAsync();
            return ServiceResult<List<ResponseBackupInfo>>.Success(backups);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return ServiceResult<List<ResponseBackupInfo>>.Fail("Lỗi khi lấy lịch sử sao lưu");
        }
    }
}

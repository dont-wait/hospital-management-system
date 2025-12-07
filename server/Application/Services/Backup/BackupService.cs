using Application.Common.DTOs.Backup;
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

    public async Task<ServiceResult<InspectBackupResponseDTO>> InspectBackupFilesAsync(InspectBackupRequestDTO request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.BackupPath))
            {
                return ServiceResult<InspectBackupResponseDTO>.Fail("BackupPath không được để trống");
            }

            if (request.FileNames == null || request.FileNames.Count == 0)
            {
                return ServiceResult<InspectBackupResponseDTO>.Fail("Danh sách file backup không được để trống");
            }

            var response = new InspectBackupResponseDTO();

            foreach (var fileName in request.FileNames)
            {
                var metadata = await _backupRepository.InspectBackupFileAsync(request.BackupPath, fileName);
                response.Metadata.Add(metadata);
            }

            response.Validation = ValidateBackupChain(response.Metadata);

            return ServiceResult<InspectBackupResponseDTO>.Success(response);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return ServiceResult<InspectBackupResponseDTO>.Fail($"Lỗi khi inspect backup files: {ex.Message}");
        }
    }

    private BackupChainValidationDTO ValidateBackupChain(List<BackupFileMetadataDTO> metadata)
    {
        var validation = new BackupChainValidationDTO();

        var validFiles = metadata.Where(m => m.IsValid).ToList();

        if (validFiles.Count == 0)
        {
            validation.IsValid = false;
            validation.Errors.Add("Không có file backup hợp lệ nào");
            return validation;
        }

        var fullBackups = validFiles.Where(m => m.BackupTypeText == "FULL").ToList();
        
        if (fullBackups.Count == 0)
        {
            validation.IsValid = false;
            validation.HasFullBackup = false;
            validation.Errors.Add("Thiếu FULL backup - không thể restore");
            return validation;
        }

        if (fullBackups.Count > 1)
        {
            validation.Warnings.Add("Có nhiều hơn 1 FULL backup - chỉ sử dụng file mới nhất");
        }

        var fullBackup = fullBackups.OrderByDescending(f => f.BackupFinishDate).First();
        validation.HasFullBackup = true;
        validation.FullBackupFileName = fullBackup.FileName;

        var diffBackups = validFiles.Where(m => m.BackupTypeText == "DIFF").ToList();
        
        if (diffBackups.Count > 0)
        {
            validation.HasDifferentialBackup = true;

            if (diffBackups.Count > 1)
            {
                validation.Warnings.Add("Có nhiều hơn 1 DIFF backup - chỉ sử dụng file mới nhất");
            }

            var diffBackup = diffBackups.OrderByDescending(d => d.BackupFinishDate).First();
            validation.DifferentialBackupFileName = diffBackup.FileName;

            if (diffBackup.DifferentialBaseLSN.HasValue)
            {
                if (diffBackup.DifferentialBaseLSN.Value == fullBackup.DatabaseBackupLSN)
                {
                    validation.DifferentialMatchesBase = true;
                }
                else
                {
                    validation.DifferentialMatchesBase = false;
                    validation.Errors.Add($"    DIFF backup '{diffBackup.FileName}' không khớp với FULL backup '{fullBackup.FileName}'");
                    validation.Errors.Add($"    DifferentialBaseLSN ({diffBackup.DifferentialBaseLSN}) != DatabaseBackupLSN ({fullBackup.DatabaseBackupLSN})");
                }
            }
            else
            {
                validation.DifferentialMatchesBase = false;
                validation.Errors.Add($"    DIFF backup '{diffBackup.FileName}' không có DifferentialBaseLSN");
            }
        }

        var logBackups = validFiles.Where(m => m.BackupTypeText == "LOG").ToList();
        validation.LogBackupCount = logBackups.Count;

        if (logBackups.Count > 0)
        {
            var sortedLogs = logBackups.OrderBy(l => l.FirstLSN).ToList();

            bool logChainValid = true;
            
            decimal baseLSN;
            if (diffBackups.Count > 0)
            {
                var diffBackup = diffBackups.OrderByDescending(d => d.BackupFinishDate).First();
                baseLSN = diffBackup.LastLSN;
            }
            else
            {
                baseLSN = fullBackup.LastLSN;
            }

            if (sortedLogs[0].FirstLSN < baseLSN)
            {
                logChainValid = false;
                validation.Errors.Add($"    LOG backup đầu tiên '{sortedLogs[0].FileName}' không liên tục với base backup");
                validation.Errors.Add($"    FirstLSN ({sortedLogs[0].FirstLSN}) < Base LastLSN ({baseLSN})");
            }

            for (int i = 1; i < sortedLogs.Count; i++)
            {
                var prevLog = sortedLogs[i - 1];
                var currentLog = sortedLogs[i];
                if (currentLog.FirstLSN < prevLog.FirstLSN)
                {
                    logChainValid = false;
                    validation.Errors.Add($"    LOG chain bị đứt giữa '{prevLog.FileName}' và '{currentLog.FileName}'");
                    validation.Errors.Add($"    Current FirstLSN ({currentLog.FirstLSN}) < Previous FirstLSN ({prevLog.FirstLSN})");
                }
            }

            validation.LogChainContinuous = logChainValid;

            if (!logChainValid)
            {
                validation.Errors.Add("     LOG chain không liên tục - restore có thể thất bại");
            }
        }
        else
        {
            validation.LogChainContinuous = true;
        }

        // Xác định recommended restore order
        validation.RecommendedRestoreOrder.Add($"1. FULL: {validation.FullBackupFileName}");
        
        if (validation.HasDifferentialBackup && validation.DifferentialMatchesBase)
        {
            validation.RecommendedRestoreOrder.Add($"2. DIFF: {validation.DifferentialBackupFileName}");
        }

        if (logBackups.Count > 0)
        {
            var sortedLogs = logBackups.OrderBy(l => l.FirstLSN).ToList();
            int logNumber = validation.HasDifferentialBackup && validation.DifferentialMatchesBase ? 3 : 2;
            
            foreach (var log in sortedLogs)
            {
                validation.RecommendedRestoreOrder.Add($"{logNumber}. LOG: {log.FileName}");
                logNumber++;
            }
        }

        validation.IsValid = validation.HasFullBackup && 
                            validation.Errors.Count == 0 &&
                            (!validation.HasDifferentialBackup || validation.DifferentialMatchesBase) &&
                            (logBackups.Count == 0 || validation.LogChainContinuous);

        return validation;
    }

    public async Task<ServiceResult<RestoreDatabaseResponseDTO>> RestoreDatabaseAsync(RestoreDatabaseRequestDTO request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.DatabaseName))
            {
                return ServiceResult<RestoreDatabaseResponseDTO>.Fail("DatabaseName không được để trống");
            }

            if (string.IsNullOrWhiteSpace(request.BackupPath))
            {
                return ServiceResult<RestoreDatabaseResponseDTO>.Fail("BackupPath không được để trống");
            }

            if (request.BackupFiles == null || request.BackupFiles.Count == 0)
            {
                return ServiceResult<RestoreDatabaseResponseDTO>.Fail("Danh sách backup files không được để trống");
            }

            var inspectRequest = new InspectBackupRequestDTO
            {
                BackupPath = request.BackupPath,
                FileNames = request.BackupFiles
            };

            var inspectResult = await InspectBackupFilesAsync(inspectRequest);
            
            if (!inspectResult.IsSuccess)
            {
                return ServiceResult<RestoreDatabaseResponseDTO>.Fail(inspectResult.Message);
            }

            var validation = inspectResult.Data!.Validation;

            if (!validation.IsValid)
            {
                var errorMessage = "Backup chain không hợp lệ:\n" + string.Join("\n", validation.Errors);
                return ServiceResult<RestoreDatabaseResponseDTO>.Fail(errorMessage);
            }

            string fullBackupFile = validation.FullBackupFileName!;
            string? diffBackupFile = validation.HasDifferentialBackup && validation.DifferentialMatchesBase 
                ? validation.DifferentialBackupFileName 
                : null;

            var metadata = inspectResult.Data!.Metadata;
            var logBackups = metadata
                .Where(m => m.BackupTypeText == "LOG" && m.IsValid)
                .OrderBy(m => m.FirstLSN)
                .Select(m => m.FileName)
                .ToList();

            string? logBackupFiles = logBackups.Count > 0 
                ? string.Join(",", logBackups) 
                : null;

            var response = await _backupRepository.RestoreDatabaseAsync(
                request.DatabaseName,
                request.BackupPath,
                fullBackupFile,
                diffBackupFile,
                logBackupFiles,
                request.StopAt,
                request.WithRecovery,
                request.ForceReplace
            );

            if (response.Status == "SUCCESS")
            {
                return ServiceResult<RestoreDatabaseResponseDTO>.Success(response);
            }
            else
            {
                return ServiceResult<RestoreDatabaseResponseDTO>.Fail(response.Message);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return ServiceResult<RestoreDatabaseResponseDTO>.Fail($"Lỗi khi restore database: {ex.Message}");
        }
    }
}

using System.Data;
using Application.Common.DTOs.Backup;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

public class BackupRepository : IBackupRepository
{
    private readonly AppDbContext _context;

    public BackupRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task SaveBackupInfoAsync(RequestBackupInfo backupInfo)
    {
        var connection = _context.Database.GetDbConnection();
        await connection.OpenAsync();

        using var command = connection.CreateCommand();
        command.CommandText = "sp_ScheduledBackup";
        command.CommandType = CommandType.StoredProcedure;

        command.Parameters.Add(new SqlParameter("@BackupType", SqlDbType.VarChar) { Value = backupInfo.BackupType });

        await command.ExecuteReaderAsync();
    }

    public async Task<List<ResponseBackupInfo>> GetAllRecentBackupsAsync()
    {
        var connection = _context.Database.GetDbConnection();
        await connection.OpenAsync();

        using var command = connection.CreateCommand();
        command.CommandText = "PC_ViewBackupHistory";
        command.CommandType = CommandType.StoredProcedure;

        var backups = new List<ResponseBackupInfo>();

        using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            var fullFileName = reader.GetString(reader.GetOrdinal("BackupFileName"));
            var fileName = fullFileName.Replace("/var/opt/mssql/backups/", "");
            
            var backup = new ResponseBackupInfo
            {
                Id = reader.GetInt32(reader.GetOrdinal("Id")),
                BackupType = reader.GetString(reader.GetOrdinal("BackupType")),
                ActionBy = reader.GetString(reader.GetOrdinal("ActionBy")),
                BackupDate = reader.GetDateTime(reader.GetOrdinal("BackupDate")),
                FileName = fileName,
                Status = reader.GetString(reader.GetOrdinal("Status")),
                CreatedDate = reader.GetDateTime(reader.GetOrdinal("CreatedDate"))
            };
            backups.Add(backup);
        }

        return backups;
    }

    public async Task<BackupFileMetadataDTO> InspectBackupFileAsync(string backupPath, string fileName)
    {
        var connection = _context.Database.GetDbConnection();
        if (connection.State != ConnectionState.Open)
        {
            await connection.OpenAsync();
        }

        // Chuẩn hóa path (Linux format)
        if (!backupPath.EndsWith("/"))
        {
            backupPath += "/";
        }

        string fullPath = backupPath + fileName;

        using var command = connection.CreateCommand();
        command.CommandText = $"RESTORE HEADERONLY FROM DISK = @BackupPath";
        command.CommandType = CommandType.Text;
        command.Parameters.Add(new SqlParameter("@BackupPath", fullPath));

        var metadata = new BackupFileMetadataDTO
        {
            FileName = fileName
        };

        try
        {
            using var reader = await command.ExecuteReaderAsync();
            
            if (await reader.ReadAsync())
            {
                metadata.DatabaseName = reader.GetString(reader.GetOrdinal("DatabaseName"));
                
                var backupTypeOrdinal = reader.GetOrdinal("BackupType");
                metadata.BackupType = Convert.ToInt32(reader.GetValue(backupTypeOrdinal));
                
                metadata.BackupTypeText = metadata.BackupType switch
                {
                    1 => "FULL",
                    5 => "DIFF",
                    2 => "LOG",
                    _ => "UNKNOWN"
                };

                metadata.FirstLSN = reader.GetDecimal(reader.GetOrdinal("FirstLSN"));
                metadata.LastLSN = reader.GetDecimal(reader.GetOrdinal("LastLSN"));
                metadata.DatabaseBackupLSN = reader.GetDecimal(reader.GetOrdinal("DatabaseBackupLSN"));
                metadata.CheckpointLSN = reader.GetDecimal(reader.GetOrdinal("CheckpointLSN"));
                
                var diffBaseLsnOrdinal = reader.GetOrdinal("DifferentialBaseLSN");
                if (!reader.IsDBNull(diffBaseLsnOrdinal))
                {
                    metadata.DifferentialBaseLSN = reader.GetDecimal(diffBaseLsnOrdinal);
                }

                metadata.BackupStartDate = reader.GetDateTime(reader.GetOrdinal("BackupStartDate"));
                metadata.BackupFinishDate = reader.GetDateTime(reader.GetOrdinal("BackupFinishDate"));
                metadata.BackupSize = reader.GetInt64(reader.GetOrdinal("BackupSize"));
                
                var compressedOrdinal = reader.GetOrdinal("Compressed");
                metadata.IsCompressed = !reader.IsDBNull(compressedOrdinal) && Convert.ToInt32(reader.GetValue(compressedOrdinal)) > 0;

                metadata.Position = reader.GetInt16(reader.GetOrdinal("Position"));
                
                var copyOnlyOrdinal = reader.GetOrdinal("IsCopyOnly");
                metadata.IsCopyOnly = !reader.IsDBNull(copyOnlyOrdinal) && reader.GetBoolean(copyOnlyOrdinal);

                var recoveryModelOrdinal = reader.GetOrdinal("RecoveryModel");
                if (!reader.IsDBNull(recoveryModelOrdinal))
                {
                    metadata.RecoveryModel = reader.GetString(recoveryModelOrdinal);
                }

                var softwareVersionOrdinal = reader.GetOrdinal("SoftwareVersionMajor");
                if (!reader.IsDBNull(softwareVersionOrdinal))
                {
                    metadata.SoftwareVersionMajor = Convert.ToInt32(reader.GetValue(softwareVersionOrdinal)).ToString();
                }
            }
            else
            {
                metadata.ValidationErrors.Add($"Không thể đọc metadata từ file: {fileName}");
            }
        }
        catch (Exception ex)
        {
            metadata.ValidationErrors.Add($"Lỗi khi inspect file {fileName}: {ex.Message}");
        }

        return metadata;
    }

    public async Task<RestoreDatabaseResponseDTO> RestoreDatabaseAsync(
        string databaseName,
        string backupPath,
        string fullBackupFile,
        string? diffBackupFile,
        string? logBackupFiles,
        DateTime? stopAt,
        bool withRecovery,
        bool forceReplace)
    {
        var response = new RestoreDatabaseResponseDTO
        {
            DatabaseName = databaseName,
            StartTime = DateTime.Now
        };

        var connection = _context.Database.GetDbConnection();
        if (connection.State != ConnectionState.Open)
        {
            await connection.OpenAsync();
        }

        try
        {
            using var command = connection.CreateCommand();
            command.CommandText = "sp_RestoreDatabase";
            command.CommandType = CommandType.StoredProcedure;
            command.CommandTimeout = 600; // 10 phút timeout

            command.Parameters.Add(new SqlParameter("@DatabaseName", databaseName));
            command.Parameters.Add(new SqlParameter("@BackupPath", backupPath));
            command.Parameters.Add(new SqlParameter("@FullBackupFile", fullBackupFile));
            
            command.Parameters.Add(new SqlParameter("@DiffBackupFile", (object?)diffBackupFile ?? DBNull.Value));
            command.Parameters.Add(new SqlParameter("@LogBackupFiles", (object?)logBackupFiles ?? DBNull.Value));
            command.Parameters.Add(new SqlParameter("@StopAt", (object?)stopAt ?? DBNull.Value));
            command.Parameters.Add(new SqlParameter("@WithRecovery", withRecovery));
            command.Parameters.Add(new SqlParameter("@ForceReplace", forceReplace));

            int stepNumber = 1;

            var fullStep = new RestoreStepDTO
            {
                StepNumber = stepNumber++,
                BackupType = "FULL",
                FileName = fullBackupFile,
                StartTime = DateTime.Now
            };
            response.Steps.Add(fullStep);

            await command.ExecuteNonQueryAsync();

            fullStep.EndTime = DateTime.Now;
            fullStep.Status = "SUCCESS";
            fullStep.Message = "FULL backup restored successfully";

            if (!string.IsNullOrEmpty(diffBackupFile))
            {
                var diffStep = new RestoreStepDTO
                {
                    StepNumber = stepNumber++,
                    BackupType = "DIFF",
                    FileName = diffBackupFile,
                    StartTime = DateTime.Now,
                    EndTime = DateTime.Now,
                    Status = "SUCCESS",
                    Message = "DIFF backup restored successfully"
                };
                response.Steps.Add(diffStep);
            }

            if (!string.IsNullOrEmpty(logBackupFiles))
            {
                var logFiles = logBackupFiles.Split(',');
                foreach (var logFile in logFiles)
                {
                    var logStep = new RestoreStepDTO
                    {
                        StepNumber = stepNumber++,
                        BackupType = "LOG",
                        FileName = logFile.Trim(),
                        StartTime = DateTime.Now,
                        EndTime = DateTime.Now,
                        Status = "SUCCESS",
                        Message = "LOG backup restored successfully"
                    };
                    response.Steps.Add(logStep);
                }
            }

            response.EndTime = DateTime.Now;
            response.DurationInSeconds = (response.EndTime - response.StartTime).TotalSeconds;
            response.Status = "SUCCESS";
            response.Message = "Database restored successfully";
        }
        catch (Exception ex)
        {
            response.EndTime = DateTime.Now;
            response.DurationInSeconds = (response.EndTime - response.StartTime).TotalSeconds;
            response.Status = "FAILED";
            response.Message = $"Restore failed: {ex.Message}";

            if (response.Steps.Any())
            {
                var lastStep = response.Steps.Last();
                lastStep.Status = "FAILED";
                lastStep.Message = ex.Message;
            }
        }

        return response;
    }
}
using System.Data;
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
}
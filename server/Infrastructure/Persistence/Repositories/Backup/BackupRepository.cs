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
}
CREATE OR ALTER PROCEDURE sp_CleanupOldBackups
    @BackupPath NVARCHAR(500),
    @RetentionDays INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Ensure path ends with /
    IF RIGHT(@BackupPath, 1) <> '/' SET @BackupPath = @BackupPath + '/';

    DECLARE @Command NVARCHAR(1000);

    -- Xóa file .bak
    SET @Command = 'find "' + @BackupPath + '" -name "*.bak" -mtime +' 
                    + CAST(@RetentionDays AS VARCHAR(10)) + ' -delete';
    EXEC xp_cmdshell @Command, NO_OUTPUT;

    -- Xóa file .trn
    SET @Command = 'find "' + @BackupPath + '" -name "*.trn" -mtime +' 
                    + CAST(@RetentionDays AS VARCHAR(10)) + ' -delete';
    EXEC xp_cmdshell @Command, NO_OUTPUT;

    PRINT 'Old backup files cleaned up successfully (Linux Docker).';
END;
GO

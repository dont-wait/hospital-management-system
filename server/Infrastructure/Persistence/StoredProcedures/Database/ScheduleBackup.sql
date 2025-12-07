CREATE OR ALTER PROCEDURE sp_ScheduledBackup
    @BackupType VARCHAR(10),
    @ActionBy NVARCHAR(50) = N'Thủ công',
    @DatabaseName NVARCHAR(128) = 'Hospital',
    @BackupPath NVARCHAR(500) = '/var/opt/mssql/backups',
    @RetentionDays INT = 7
AS
BEGIN
    SET NOCOUNT ON;

    -- Ensure Linux path ends with /
    IF RIGHT(@BackupPath,1) <> '/' SET @BackupPath = @BackupPath + '/';

    DECLARE @CurrentDateTime VARCHAR(20) =
        CONVERT(VARCHAR(8), GETDATE(), 112) + '_' +
        REPLACE(CONVERT(VARCHAR(8), GETDATE(), 108), ':', '');

    DECLARE @BackupFileName NVARCHAR(500);
    DECLARE @BackupName NVARCHAR(200);
    DECLARE @SQL NVARCHAR(MAX);

    IF @BackupType = 'FULL'
    BEGIN
        SET @BackupFileName = @BackupPath + @DatabaseName + '_FULL_' + @CurrentDateTime + '.bak';
        SET @BackupName = @DatabaseName + ' Full Backup ' + @CurrentDateTime;

        SET @SQL = N'
            BACKUP DATABASE ' + QUOTENAME(@DatabaseName) + '
            TO DISK = N''' + @BackupFileName + '''
            WITH NAME = N''' + @BackupName + ''',
                 COMPRESSION, STATS = 10, CHECKSUM;
        ';
    END
    ELSE IF @BackupType = 'DIFF'
    BEGIN
        SET @BackupFileName = @BackupPath + @DatabaseName + '_DIFF_' + @CurrentDateTime + '.bak';
        SET @BackupName = @DatabaseName + ' Diff Backup ' + @CurrentDateTime;

        SET @SQL = N'
            BACKUP DATABASE ' + QUOTENAME(@DatabaseName) + '
            TO DISK = N''' + @BackupFileName + '''
            WITH DIFFERENTIAL, NAME = N''' + @BackupName + ''',
                 COMPRESSION, STATS = 10, CHECKSUM;
        ';
    END
    ELSE IF @BackupType = 'LOG'
    BEGIN
        SET @BackupFileName = @BackupPath + @DatabaseName + '_LOG_' + @CurrentDateTime + '.trn';
        SET @BackupName = @DatabaseName + ' Log Backup ' + @CurrentDateTime;

        SET @SQL = N'
            BACKUP LOG ' + QUOTENAME(@DatabaseName) + '
            TO DISK = N''' + @BackupFileName + '''
            WITH NAME = N''' + @BackupName + ''',
                 COMPRESSION, STATS = 10, CHECKSUM;
        ';
    END

    BEGIN TRY
        EXEC sp_executesql @SQL;

        INSERT INTO BackupHistory (DatabaseName, BackupType, ActionBy, BackupFileName, BackupDate, Status)
        VALUES (@DatabaseName, @BackupType, @ActionBy, @BackupFileName, GETDATE(), 'SUCCESS');

        --EXEC sp_CleanupOldBackups @BackupPath, @RetentionDays;
    END TRY
    BEGIN CATCH
        DECLARE @Err NVARCHAR(4000) = ERROR_MESSAGE();

        INSERT INTO BackupHistory (DatabaseName, BackupType, BackupFileName, BackupDate, Status, ErrorMessage)
        VALUES (@DatabaseName, @BackupType, @BackupFileName, GETDATE(), 'FAILED', @Err);

        THROW;
    END CATCH
END;
GO

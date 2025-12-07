USE Hospital;
GO

CREATE OR ALTER PROCEDURE dbo.sp_AutomatedDisasterRecovery
    @DatabaseName NVARCHAR(128),
    @BackupPath   NVARCHAR(500)  -- ví dụ: /var/opt/mssql/backups
AS
BEGIN
    SET NOCOUNT ON;

    --------------------------------------------------------------------
    -- 0) Chuẩn hoá input (Docker/Linus path) + validate
    --------------------------------------------------------------------
    IF @DatabaseName IS NULL OR LTRIM(RTRIM(@DatabaseName)) = ''
    BEGIN
        RAISERROR(N'@DatabaseName is required.', 16, 1);
        RETURN;
    END;

    IF @BackupPath IS NULL OR LTRIM(RTRIM(@BackupPath)) = ''
    BEGIN
        RAISERROR(N'@BackupPath is required (example: /var/opt/mssql/backups).', 16, 1);
        RETURN;
    END;

    SET @BackupPath = LTRIM(RTRIM(@BackupPath));
    IF RIGHT(@BackupPath, 1) <> '/' SET @BackupPath = @BackupPath + '/';

    --------------------------------------------------------------------
    -- 1) Lấy tên file backup cần dùng (Full + Diff + Log chain)
    --------------------------------------------------------------------
    DECLARE @FullBackup   NVARCHAR(500);
    DECLARE @DiffBackup   NVARCHAR(500);
    DECLARE @FullDate     DATETIME;
    DECLARE @DiffDate     DATETIME;
    DECLARE @LogBackups   NVARCHAR(MAX) = NULL;

    -- FULL mới nhất (thành công)
    SELECT TOP (1)
        @FullBackup = BackupFileName,
        @FullDate   = BackupDate
    FROM dbo.BackupHistory
    WHERE DatabaseName = @DatabaseName
      AND BackupType   = 'FULL'
      AND Status       = 'SUCCESS'
    ORDER BY BackupDate DESC;

    IF @FullBackup IS NULL
    BEGIN
        RAISERROR(N'No SUCCESS FULL backup found for database [%s] in BackupHistory.', 16, 1, @DatabaseName);
        RETURN;
    END;

    -- DIFF mới nhất sau thời điểm FULL (nếu có)
    SELECT TOP (1)
        @DiffBackup = BackupFileName,
        @DiffDate   = BackupDate
    FROM dbo.BackupHistory
    WHERE DatabaseName = @DatabaseName
      AND BackupType   = 'DIFF'
      AND Status       = 'SUCCESS'
      AND BackupDate   > @FullDate
    ORDER BY BackupDate DESC;

    -- LOG chain: tất cả log sau Diff (nếu có) hoặc sau Full (nếu không có Diff)
    DECLARE @BaseDate DATETIME = ISNULL(@DiffDate, @FullDate);

    SET @LogBackups = STUFF((
        SELECT ',' + BackupFileName
        FROM dbo.BackupHistory
        WHERE DatabaseName = @DatabaseName
          AND BackupType   = 'LOG'
          AND Status       = 'SUCCESS'
          AND BackupDate   > @BaseDate
        ORDER BY BackupDate
        FOR XML PATH(''), TYPE
    ).value('.', 'NVARCHAR(MAX)'), 1, 1, '');

    --------------------------------------------------------------------
    -- 2) Debug output (dễ nhìn khi chạy)
    --------------------------------------------------------------------
    PRINT N'=== Automated DR Plan ===';
    PRINT N'Database: ' + @DatabaseName;
    PRINT N'BackupPath (container): ' + @BackupPath;
    PRINT N'FULL: ' + @FullBackup;
    PRINT N'DIFF: ' + ISNULL(@DiffBackup, N'(none)');
    PRINT N'LOGS: ' + ISNULL(@LogBackups, N'(none)');

    --------------------------------------------------------------------
    -- 3) Gọi sp_RestoreDatabase (chuẩn Docker path)
    --------------------------------------------------------------------
    EXEC dbo.sp_RestoreDatabase
        @DatabaseName   = @DatabaseName,
        @BackupPath     = @BackupPath,
        @FullBackupFile = @FullBackup,
        @DiffBackupFile = @DiffBackup,
        @LogBackupFiles = @LogBackups,
        @StopAt         = NULL,
        @WithRecovery   = 1,
        @ForceReplace   = 1;   -- cho phép REPLACE nếu DB đã tồn tại
END;
GO

CREATE OR ALTER PROCEDURE sp_RestoreDatabase
    @DatabaseName     NVARCHAR(128),
    @BackupPath       NVARCHAR(500),   -- ví dụ: /var/opt/mssql/backups
    @FullBackupFile   NVARCHAR(500),   -- ví dụ: Hospital_FULL_20251206_064921.bak
    @DiffBackupFile   NVARCHAR(500) = NULL,  -- ví dụ: Hospital_DIFF_....bak
    @LogBackupFiles   NVARCHAR(MAX) = NULL,  -- ví dụ: Log1.trn,Log2.trn,Log3.trn (theo đúng thứ tự phục hồi)
    @StopAt           DATETIME = NULL,
    @WithRecovery     BIT = 1,         -- 1 = end restore (RECOVERY), 0 = giữ NORECOVERY để tiếp tục chain
    @ForceReplace     BIT = 1          -- 1 = cho phép REPLACE nếu database đã tồn tại
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @sql NVARCHAR(MAX);
    DECLARE @dbExists BIT = 0;
    DECLARE @wasSingleUser BIT = 0;

    -- ============ 1) Chuẩn hoá path (Linux) ============
    IF @BackupPath IS NULL OR LTRIM(RTRIM(@BackupPath)) = ''
    BEGIN
        RAISERROR(N'@BackupPath is required.', 16, 1);
        RETURN;
    END;

    SET @BackupPath = LTRIM(RTRIM(@BackupPath));

    -- Nếu không kết thúc bằng '/' thì thêm vào (Docker SQL Server dùng Linux path)
    IF RIGHT(@BackupPath, 1) <> '/' 
        SET @BackupPath = @BackupPath + '/';

    -- ============ 2) Kiểm tra tham số bắt buộc ============
    IF @DatabaseName IS NULL OR LTRIM(RTRIM(@DatabaseName)) = ''
    BEGIN
        RAISERROR(N'@DatabaseName is required.', 16, 1);
        RETURN;
    END;

    IF @FullBackupFile IS NULL OR LTRIM(RTRIM(@FullBackupFile)) = ''
    BEGIN
        RAISERROR(N'@FullBackupFile is required.', 16, 1);
        RETURN;
    END;

    -- ============ 3) Xác định database có tồn tại không ============
    IF EXISTS (SELECT 1 FROM sys.databases WHERE name = @DatabaseName)
        SET @dbExists = 1;

    BEGIN TRY
        ----------------------------------------------------------------
        -- 4) Nếu database tồn tại và bạn muốn ghi đè -> chuyển SINGLE_USER
        ----------------------------------------------------------------
        IF @dbExists = 1 AND @ForceReplace = 1
        BEGIN
            SET @sql = N'ALTER DATABASE ' + QUOTENAME(@DatabaseName) +
                       N' SET SINGLE_USER WITH ROLLBACK IMMEDIATE;';
            EXEC (@sql);
            SET @wasSingleUser = 1;
        END

        ----------------------------------------------------------------
        -- 5) RESTORE FULL (luôn NORECOVERY để có thể áp được DIFF/LOG tiếp theo)
        ----------------------------------------------------------------
        SET @sql = N'RESTORE DATABASE ' + QUOTENAME(@DatabaseName) + N'
                    FROM DISK = N''' + @BackupPath + @FullBackupFile + N'''
                    WITH NORECOVERY' +
                    CASE WHEN @ForceReplace = 1 THEN N', REPLACE' ELSE N'' END +
                    N', STATS = 10, CHECKSUM;';
        PRINT N'Restoring FULL backup: ' + @BackupPath + @FullBackupFile;
        EXEC (@sql);

        ----------------------------------------------------------------
        -- 6) RESTORE DIFFERENTIAL (nếu có) - vẫn NORECOVERY
        ----------------------------------------------------------------
        IF @DiffBackupFile IS NOT NULL AND LTRIM(RTRIM(@DiffBackupFile)) <> ''
        BEGIN
            SET @sql = N'RESTORE DATABASE ' + QUOTENAME(@DatabaseName) + N'
                        FROM DISK = N''' + @BackupPath + LTRIM(RTRIM(@DiffBackupFile)) + N'''
                        WITH NORECOVERY, STATS = 10, CHECKSUM;';
            PRINT N'Restoring DIFFERENTIAL backup: ' + @BackupPath + LTRIM(RTRIM(@DiffBackupFile));
            EXEC (@sql);
        END

        ----------------------------------------------------------------
        -- 7) RESTORE LOG CHAIN (nếu có) - giữ đúng thứ tự user đưa vào
        ----------------------------------------------------------------
        IF @LogBackupFiles IS NOT NULL AND LTRIM(RTRIM(@LogBackupFiles)) <> ''
        BEGIN
            DECLARE @xml XML;
            -- Giữ thứ tự bằng XML: "a,b,c" -> <r><x>a</x><x>b</x><x>c</x></r>
            SET @xml = TRY_CAST(N'<r><x>' + 
                REPLACE(REPLACE(@LogBackupFiles, N'&', N'&amp;'), N',', N'</x><x>') +
                N'</x></r>' AS XML);

            IF @xml IS NULL
            BEGIN
                RAISERROR(N'@LogBackupFiles format is invalid (CSV).', 16, 1);
                RETURN;
            END

            DECLARE @LogFile NVARCHAR(500);

            DECLARE log_cursor CURSOR FAST_FORWARD FOR
                SELECT LTRIM(RTRIM(T.c.value('.', 'NVARCHAR(500)')))
                FROM @xml.nodes('/r/x') AS T(c);

            OPEN log_cursor;
            FETCH NEXT FROM log_cursor INTO @LogFile;

            WHILE @@FETCH_STATUS = 0
            BEGIN
                IF @LogFile <> ''
                BEGIN
                    PRINT N'Restoring LOG backup: ' + @BackupPath + @LogFile;

                    SET @sql = N'RESTORE LOG ' + QUOTENAME(@DatabaseName) + N'
                                FROM DISK = N''' + @BackupPath + @LogFile + N'''
                                WITH NORECOVERY, STATS = 10';

                    IF @StopAt IS NOT NULL
                        SET @sql += N', STOPAT = ''' + CONVERT(VARCHAR(25), @StopAt, 121) + N'''';

                    SET @sql += N';';

                    EXEC (@sql);
                END

                FETCH NEXT FROM log_cursor INTO @LogFile;
            END

            CLOSE log_cursor;
            DEALLOCATE log_cursor;
        END

        ----------------------------------------------------------------
        -- 8) Kết thúc restore (RECOVERY) hoặc giữ NORECOVERY theo yêu cầu
        ----------------------------------------------------------------
        IF @WithRecovery = 1
        BEGIN
            PRINT N'Recovering database (WITH RECOVERY)...';
            SET @sql = N'RESTORE DATABASE ' + QUOTENAME(@DatabaseName) + N' WITH RECOVERY;';
            EXEC (@sql);

            -- Trả về MULTI_USER (chỉ khi đã recovery xong)
            SET @sql = N'ALTER DATABASE ' + QUOTENAME(@DatabaseName) + N' SET MULTI_USER;';
            EXEC (@sql);
            SET @wasSingleUser = 0;
        END
        ELSE
        BEGIN
            PRINT N'Leaving database in NORECOVERY state (ready for next restore step).';
            -- Không set MULTI_USER vì DB đang ở trạng thái restoring.
        END

        ----------------------------------------------------------------
        -- 9) Ghi lịch sử (nếu có bảng RestoreHistory)
        ----------------------------------------------------------------
        IF OBJECT_ID(N'dbo.RestoreHistory', N'U') IS NOT NULL
        BEGIN
            INSERT INTO dbo.RestoreHistory
                (DatabaseName, RestoreDate, FullBackupFile, DiffBackupFile, Status)
            VALUES
                (@DatabaseName, GETDATE(), @FullBackupFile, @DiffBackupFile, N'SUCCESS');
        END
        ELSE
        BEGIN
            PRINT N'Info: table RestoreHistory not found (skip logging).';
        END
    END TRY
    BEGIN CATCH
        DECLARE @err NVARCHAR(4000) = ERROR_MESSAGE();

        -- Nếu trước đó đã set SINGLE_USER mà restore thất bại, cố trả về MULTI_USER (khi có thể)
        IF @wasSingleUser = 1
        BEGIN
            BEGIN TRY
                SET @sql = N'ALTER DATABASE ' + QUOTENAME(@DatabaseName) + N' SET MULTI_USER;';
                EXEC (@sql);
            END TRY
            BEGIN CATCH
                -- bỏ qua để tránh che lỗi gốc
            END CATCH;
        END

        IF OBJECT_ID(N'dbo.RestoreHistory', N'U') IS NOT NULL
        BEGIN
            INSERT INTO dbo.RestoreHistory
                (DatabaseName, RestoreDate, FullBackupFile, DiffBackupFile, Status, ErrorMessage)
            VALUES
                (@DatabaseName, GETDATE(), @FullBackupFile, @DiffBackupFile, N'FAILED', @err);
        END
    END CATCH
END;
GO

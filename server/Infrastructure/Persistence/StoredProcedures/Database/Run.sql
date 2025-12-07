-- Tạo các bảng lịch sử
-- Chạy script CreateHistoryTables.sql

-- Tạo các stored procedures
-- Chạy lần lượt các script procedures

-- Tạo SQL Agent Jobs
-- Chạy CreateBackupJobs.sql và điều chỉnh tham số phù hợp
use Hospital
-- Full Backup
EXEC sp_ScheduledBackup 
    @DatabaseName = 'Hospital',
    @BackupPath = '/var/opt/mssql/backups',
    @BackupType = 'FULL';


insert into departments (Name, Location, Description) values ('khoa test', 'test', 'test test test');

EXEC sp_ScheduledBackup
	@DatabaseName = 'Hospital',
	@BackupPath = '/var/opt/mssql/backups',
	@BackupType = 'DIFF'

insert into departments (Name, Location, Description) values ('khoa test 2', 'test 2', 'test test test');

EXEC sp_ScheduledBackup
	@DatabaseName = 'Hospital',
	@BackupPath = '/var/opt/mssql/backups',
	@BackupType = 'LOG'

-- Xem lịch sử backup
SELECT * FROM BackupHistory ORDER BY BackupDate DESC;

-- DROP DATABASE
use master;
go

drop database Hospital;
go


-- Thay thế bằng tên file backup thực tế của bạn

-- Restore database
-- FULL
DECLARE @FullBackup NVARCHAR(500);
SET @FullBackup = 'Hospital_FULL_20251206_112801.bak';
EXEC sp_RestoreDatabase
    @DatabaseName = 'Hospital',
    @BackupPath = '/var/opt/mssql/backups',
    @FullBackupFile = @FullBackup,
    @DiffBackupFile = NULL,
    @LogBackupFiles = NULL

-- DIFF
DECLARE @DiffBackup NVARCHAR(500);
SET @DiffBackup = 'Hospital_DIFF_20251206_114030';
EXEC sp_RestoreDatabase
    @DatabaseName = 'Hospital',
    @BackupPath = '/var/opt/mssql/backups',
    @FullBackupFile = @DiffBackup,
    @DiffBackupFile = NULL,
    @LogBackupFiles = NULL

-- LOG
DECLARE @LogBackup NVARCHAR(500);
SET @LogBackup = 'Hospital_LOG_20251206_114049.trn';
EXEC sp_RestoreDatabase
    @DatabaseName = 'Hospital',
    @BackupPath = '/var/opt/mssql/backups',
    @FullBackupFile = @LogBackup,
    @DiffBackupFile = NULL,
    @LogBackupFiles = NULL


-- Xem lịch sử restore
SELECT * FROM RestoreHistory ORDER BY RestoreDate DESC;

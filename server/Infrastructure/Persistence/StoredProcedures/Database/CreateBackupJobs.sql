USE msdb;
GO

DECLARE @DB NVARCHAR(128) = 'Hospital';
DECLARE @BackupPath NVARCHAR(500) = 'D:\Backups\';

DECLARE @cmdFull NVARCHAR(MAX);
DECLARE @cmdDiff NVARCHAR(MAX);
DECLARE @cmdLog NVARCHAR(MAX);

-- Build command strings before using them
SET @cmdFull = '
EXEC sp_ScheduledBackup 
    @DatabaseName = ''' + @DB + ''',
    @BackupPath = ''' + @BackupPath + ''',
    @BackupType = ''FULL'',
    @RetentionDays = 30;
';

SET @cmdDiff = '
EXEC sp_ScheduledBackup 
    @DatabaseName = ''' + @DB + ''',
    @BackupPath = ''' + @BackupPath + ''',
    @BackupType = ''DIFF'',
    @RetentionDays = 7;
';

SET @cmdLog = '
EXEC sp_ScheduledBackup 
    @DatabaseName = ''' + @DB + ''',
    @BackupPath = ''' + @BackupPath + ''',
    @BackupType = ''LOG'',
    @RetentionDays = 3;
';

-------------------------------------------------------
-- DELETE OLD JOBS
-------------------------------------------------------
IF EXISTS (SELECT 1 FROM msdb.dbo.sysjobs WHERE name = 'Weekly Full Database Backup')
    EXEC sp_delete_job @job_name = 'Weekly Full Database Backup';

IF EXISTS (SELECT 1 FROM msdb.dbo.sysjobs WHERE name = 'Daily Differential Database Backup')
    EXEC sp_delete_job @job_name = 'Daily Differential Database Backup';

IF EXISTS (SELECT 1 FROM msdb.dbo.sysjobs WHERE name = 'Hourly Transaction Log Backup')
    EXEC sp_delete_job @job_name = 'Hourly Transaction Log Backup';


-------------------------------------------------------
-- JOB 1 — FULL BACKUP
-------------------------------------------------------
EXEC sp_add_job
    @job_name = N'Weekly Full Database Backup',
    @enabled = 1;

EXEC sp_add_jobstep
    @job_name = N'Weekly Full Database Backup',
    @step_name = N'Run Full Backup',
    @subsystem = N'TSQL',
    @command = @cmdFull;

EXEC sp_add_schedule
    @schedule_name = N'Weekly Sunday Schedule',
    @freq_type = 8,
    @freq_interval = 1,
    @active_start_time = 020000;

EXEC sp_attach_schedule
    @job_name = N'Weekly Full Database Backup',
    @schedule_name = N'Weekly Sunday Schedule';

EXEC sp_add_jobserver
    @job_name = N'Weekly Full Database Backup';


-------------------------------------------------------
-- JOB 2 — DIFF BACKUP
-------------------------------------------------------
EXEC sp_add_job
    @job_name = N'Daily Differential Database Backup',
    @enabled = 1;

EXEC sp_add_jobstep
    @job_name = N'Daily Differential Database Backup',
    @step_name = N'Run Diff Backup',
    @subsystem = N'TSQL',
    @command = @cmdDiff;

EXEC sp_add_schedule
    @schedule_name = N'Daily Diff Schedule',
    @freq_type = 4,
    @freq_interval = 1,
    @active_start_time = 003000;

EXEC sp_attach_schedule
    @job_name = N'Daily Differential Database Backup',
    @schedule_name = N'Daily Diff Schedule';

EXEC sp_add_jobserver
    @job_name = N'Daily Differential Database Backup';


-------------------------------------------------------
-- JOB 3 — LOG BACKUP
-------------------------------------------------------
EXEC sp_add_job
    @job_name = N'Hourly Transaction Log Backup',
    @enabled = 1;

EXEC sp_add_jobstep
    @job_name = N'Hourly Transaction Log Backup',
    @step_name = N'Run Log Backup',
    @subsystem = N'TSQL',
    @command = @cmdLog;

EXEC sp_add_schedule
    @schedule_name = N'Hourly Log Schedule',
    @freq_type = 4,
    @freq_interval = 1,
    @freq_subday_type = 8,
    @freq_subday_interval = 1,
    @active_start_time = 000500;

EXEC sp_attach_schedule
    @job_name = N'Hourly Transaction Log Backup',
    @schedule_name = N'Hourly Log Schedule';

EXEC sp_add_jobserver
    @job_name = N'Hourly Transaction Log Backup';

PRINT 'All backup jobs created successfully!';
GO

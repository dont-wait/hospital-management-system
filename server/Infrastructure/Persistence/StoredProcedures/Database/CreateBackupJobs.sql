-- Job 1: Full Backup (Hàng tuần - Chủ nhật)
USE msdb;
GO

EXEC sp_add_job
    @job_name = N'Weekly Full Database Backup',
    @enabled = 1,
    @description = N'Full backup of all user databases every Sunday';

EXEC sp_add_jobstep
    @job_name = N'Weekly Full Database Backup',
    @step_name = N'Execute Full Backup',
    @subsystem = N'TSQL',
    @command = N'EXEC sp_ScheduledBackup 
                    @DatabaseName = ''YourDatabaseName'',
                    @BackupPath = ''C:\Backups\'',
                    @BackupType = ''FULL'',
                    @RetentionDays = 30';

EXEC sp_add_schedule
    @schedule_name = N'Weekly Sunday Backup',
    @freq_type = 8, -- Weekly
    @freq_interval = 1, -- Sunday
    @freq_recurrence_factor = 1,
    @active_start_time = 020000; -- 2:00 AM

EXEC sp_attach_schedule
    @job_name = N'Weekly Full Database Backup',
    @schedule_name = N'Weekly Sunday Backup';

EXEC sp_add_jobserver
    @job_name = N'Weekly Full Database Backup';

-- Job 2: Differential Backup (Hàng ngày)
EXEC sp_add_job
    @job_name = N'Daily Differential Database Backup',
    @enabled = 1,
    @description = N'Differential backup of all user databases daily';

EXEC sp_add_jobstep
    @job_name = N'Daily Differential Database Backup',
    @step_name = N'Execute Differential Backup',
    @subsystem = N'TSQL',
    @command = N'EXEC sp_ScheduledBackup 
                    @DatabaseName = ''YourDatabaseName'',
                    @BackupPath = ''C:\Backups\'',
                    @BackupType = ''DIFF'',
                    @RetentionDays = 7';

EXEC sp_add_schedule
    @schedule_name = N'Daily Backup Schedule',
    @freq_type = 4, -- Daily
    @freq_interval = 1,
    @active_start_time = 000000; -- Midnight

EXEC sp_attach_schedule
    @job_name = N'Daily Differential Database Backup',
    @schedule_name = N'Daily Backup Schedule';

EXEC sp_add_jobserver
    @job_name = N'Daily Differential Database Backup';

-- Job 3: Transaction Log Backup (Mỗi giờ)
EXEC sp_add_job
    @job_name = N'Hourly Transaction Log Backup',
    @enabled = 1,
    @description = N'Transaction log backup every hour';

EXEC sp_add_jobstep
    @job_name = N'Hourly Transaction Log Backup',
    @step_name = N'Execute Log Backup',
    @subsystem = N'TSQL',
    @command = N'EXEC sp_ScheduledBackup 
                    @DatabaseName = ''YourDatabaseName'',
                    @BackupPath = ''C:\Backups\'',
                    @BackupType = ''LOG'',
                    @RetentionDays = 3';

EXEC sp_add_schedule
    @schedule_name = N'Hourly Backup Schedule',
    @freq_type = 4, -- Daily
    @freq_interval = 1,
    @freq_subday_type = 8, -- Hours
    @freq_subday_interval = 1; -- Every 1 hour

EXEC sp_attach_schedule
    @job_name = N'Hourly Transaction Log Backup',
    @schedule_name = N'Hourly Backup Schedule';

EXEC sp_add_jobserver
    @job_name = N'Hourly Transaction Log Backup';
GO
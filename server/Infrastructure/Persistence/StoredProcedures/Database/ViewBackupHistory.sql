use Hospital;
go

Create or alter procedure PC_ViewBackupHistory
AS
BEGIN
	SELECT * FROM BackupHistory ORDER BY BackupDate DESC;
END
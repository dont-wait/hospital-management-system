-- Bảng lưu lịch sử backup
CREATE TABLE BackupHistory (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    DatabaseName NVARCHAR(128) NOT NULL,
    BackupType VARCHAR(10) NOT NULL,
    ActionBy NVARCHAR(50) NOT NULL,
    BackupFileName NVARCHAR(500) NOT NULL,
    BackupDate DATETIME NOT NULL,
    Status VARCHAR(20) NOT NULL,
    ErrorMessage NVARCHAR(MAX) NULL,
    FileSize BIGINT NULL,
    CreatedDate DATETIME DEFAULT GETDATE()
);

-- Bảng lưu lịch sử restore
CREATE TABLE RestoreHistory (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    DatabaseName NVARCHAR(128) NOT NULL,
    RestoreDate DATETIME NOT NULL,
    FullBackupFile NVARCHAR(500) NOT NULL,
    DiffBackupFile NVARCHAR(500) NULL,
    Status VARCHAR(20) NOT NULL,
    ErrorMessage NVARCHAR(MAX) NULL,
    CreatedDate DATETIME DEFAULT GETDATE()
);

-- Index để tăng hiệu suất query
CREATE INDEX IX_BackupHistory_DatabaseName_Date 
ON BackupHistory(DatabaseName, BackupDate DESC);

CREATE INDEX IX_RestoreHistory_DatabaseName_Date 
ON RestoreHistory(DatabaseName, RestoreDate DESC);
GO
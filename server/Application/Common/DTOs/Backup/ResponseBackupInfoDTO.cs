public class ResponseBackupInfo
{
    public int Id { get; set; }
    public string BackupType { get; set; } = string.Empty; // FULL, DIFF, LOG
    public DateTime BackupDate { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; // SUCCESS, FAILED
    public DateTime CreatedDate { get; set; }
}

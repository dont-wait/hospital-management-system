using Hangfire;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BackupController : ControllerBase
{
    private readonly IBackupService _backupService;
    private readonly IRecurringJobManager _recurringJobManager;

    public BackupController(IBackupService backupService, IRecurringJobManager recurringJobManager)
    {
        _backupService = backupService;
        _recurringJobManager = recurringJobManager;
    }

    [HttpPost]
    public async Task<IActionResult> CreateBackup([FromBody] RequestBackupInfo backupInfo)
    {
        var result = await _backupService.CreateBackupAsync(backupInfo);
        if (result.IsSuccess)
        {
            return Ok(new
            {
                status = 201,
                message = $"Tạo bản sao lưu {backupInfo.BackupType} thành công",
                data = result.Data 
            });
        }
        
        return BadRequest(new
        {
            status = 400,
            message = result.Message
        });
    }
}

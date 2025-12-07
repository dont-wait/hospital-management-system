using Application.Common.DTOs.Backup;
using Application.Common.Utils;
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

    [HttpGet("history")]
    public async Task<IActionResult> GetBackupHistory()
    {
        var result = await _backupService.GetAllRecentBackupsAsync();
        if (result.IsSuccess)
        {
            return new JsonResult(new ApiResponse<List<ResponseBackupInfo>>(200, "Lấy lịch sử sao lưu thành công", result.Data)) { StatusCode = 200 };
        }
        
        return new JsonResult(new ApiResponse<List<ResponseBackupInfo>>(400, result.Message, null)) { StatusCode = 400 };
    }

    [HttpPost("inspect")]
    public async Task<IActionResult> InspectBackupFiles([FromBody] InspectBackupRequestDTO request)
    {
        var result = await _backupService.InspectBackupFilesAsync(request);
        
        if (result.IsSuccess)
        {
            return Ok(new
            {
                status = 200,
                message = "Inspect backup files thành công",
                data = result.Data
            });
        }
        
        return BadRequest(new
        {
            status = 400,
            message = result.Message,
            data = (InspectBackupResponseDTO?)null
        });
    }

    [HttpPost("restore")]
    public async Task<IActionResult> RestoreDatabase([FromBody] RestoreDatabaseRequestDTO request)
    {
        var result = await _backupService.RestoreDatabaseAsync(request);
        
        if (result.IsSuccess)
        {
            return Ok(new
            {
                status = 200,
                message = "Restore database thành công",
                data = result.Data
            });
        }
        
        return BadRequest(new
        {
            status = 400,
            message = result.Message,
            data = (RestoreDatabaseResponseDTO?)null
        });
    }
}

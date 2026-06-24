using Application.Common.DTOs.Billing;
using Application.Common.Utils;
using Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers.Billing;

[ApiController]
[Route("api/billings")]
public class BillingController : ControllerBase
{
    private readonly IBillingService _billingService;
    private readonly IDepartmentService _departmentService;

    public BillingController(IBillingService billingService, IDepartmentService departmentService)
    {
        _billingService = billingService;
        _departmentService = departmentService;
    }

    [HttpGet]
    [Authorize(Roles = "admin, doctor, patient")]
    public async Task<IActionResult> GetBillings([FromQuery] string? status,
                                             [FromQuery] Guid? patientId,
                                             [FromQuery] Guid? doctorId,
                                             [FromQuery] int page = 1,
                                             [FromQuery] int size = 3)
    {
        var result = await _billingService.GetBillingsAsync(status, patientId, doctorId, page, size);
        
        if (!result.IsSuccess)
            return BadRequest(new { message = result.Message });

        return Ok(new
        {
            status = 200,
            message = "Lấy danh sách hóa đơn thành công",
            data = result.Data!.Items,
            page = result.Data.CurrentPage,
            size = result.Data.PageSize,
            totalPages = result.Data.TotalPages,
            totalRecords = result.Data.TotalRecords
        });
    }
    
    [HttpGet("{billingId:long}")]
    public async Task<IActionResult> GetBillingById(long billingId)
    {
        var result = await _billingService.GetBillingByIdAsync(billingId);
        
        if (!result.IsSuccess)
            return NotFound(new { message = result.Message });

        return Ok(new
        {
            status = 200,
            message = "Lấy thông tin hóa đơn thành công",
            data = result.Data
        });
    }
    
    [HttpPost]
    public async Task<IActionResult> CreateBilling([FromBody] RequestBillingDTO request)
    {
        var result = await _billingService.CreateBillingAsync(request);
        
        if (!result.IsSuccess)
            return BadRequest(new { message = result.Message });

        return Ok(new
        {
            status = 201,
            message = result.Data
        });
    }

    [HttpGet("transactions")]
    public async Task<IActionResult> GetLatestTransactions(
        [FromQuery] int page = 1, 
        [FromQuery] int count = 5,
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null)
    {
        var result = await _billingService.GetLatestTransactionsAsync(page, count, fromDate, toDate);

        if (!result.IsSuccess)
            return BadRequest(new { message = result.Message });

        return Ok(new
        {
            status = 200,
            message = "Lấy danh sách giao dịch gần đây thành công",
            data = result.Data
        });
    }

    [HttpGet("revenues")]
    public async Task<IActionResult> GetAllRevenue(
        [FromQuery] string type = "day",
        [FromQuery] DateTime? date = null,
        [FromQuery] DateTime? toDate = null)
    {
        var result = await _billingService.GetAllRevenueAsync(type, date, toDate);

        if (!result.IsSuccess)
            return BadRequest(new { message = result.Message });

        return Ok(new
        {
            status = 200,
            message = "Lấy dữ liệu doanh thu thành công",
            data = result.Data
        });
    }

    [HttpGet("revenues/category")]
    public async Task<IActionResult> GetRevenueByCategory(
        [FromQuery] string type = "day",
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null)
    {
        var result = await _billingService.GetRevenueByCategoryAsync(type, fromDate, toDate);

        if (!result.IsSuccess)
            return BadRequest(new { message = result.Message });

        return Ok(new
        {
            status = 200,
            message = "Lấy dữ liệu doanh thu theo danh mục thành công",
            data = result.Data
        });
    }

    [HttpGet("revenues/export")]
    public async Task<IActionResult> ExportRevenueDataToExcel(
        [FromQuery] string type = "day",
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null
    )
    {
        byte[] files = await _departmentService.ExportDepartmentRevenueAsync(type, fromDate, toDate);

        return File(
            fileContents: files,
            contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            fileDownloadName: $"Revenue_{DateTime.Now:yyyyMMddHHmmss}.xlsx"
        );
    }
}

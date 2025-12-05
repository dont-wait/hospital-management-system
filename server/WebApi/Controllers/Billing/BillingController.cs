using Application.Common.DTOs.Billing;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers.Billing;

[ApiController]
[Route("api/billings")]
public class BillingController : ControllerBase
{
    private readonly IBillingService _billingService;
    
    public BillingController(IBillingService billingService)
    {
        _billingService = billingService;
    }

    [HttpGet]
    public async Task<IActionResult> GetBillings([FromQuery] string? status,
                                             [FromQuery] Guid? patientId,
                                             [FromQuery] Guid? doctorId,
                                             [FromQuery] int page = 1,
                                             [FromQuery] int size = 20)
    {
        var result = await _billingService.GetBillingsAsync(status, patientId, doctorId, page, size);
        
        if (!result.IsSuccess)
            return BadRequest(new { message = result.Message });

        return Ok(new
        {
            status = 200,
            message = "Lấy danh sách hóa đơn thành công",
            data = result.Data,
            page,
            size
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
    
    [HttpGet("patient/{patientId:guid}")]
    public async Task<IActionResult> GetBillingsByPatientId(Guid patientId,
                                                             [FromQuery] int page = 1,
                                                             [FromQuery] int size = 20)
    {
        var result = await _billingService.GetBillingsAsync(null, patientId, null, page, size);
        
        if (!result.IsSuccess)
            return BadRequest(new { message = result.Message });

        return Ok(new
        {
            status = 200,
            message = "Lấy danh sách hóa đơn của bệnh nhân thành công",
            data = result.Data,
            page,
            size
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
}
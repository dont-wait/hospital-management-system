using Application.Services.Billing;
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
        return null;
    }
    
    [HttpGet("{patientId:guid}")]
    public async Task<IActionResult> GetBillingsByPatientId(Guid patientId)
    {
        return null;
    }
}
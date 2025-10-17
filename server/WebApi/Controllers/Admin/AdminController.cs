using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Application.Common.Utils;

namespace WebApi.Controllers.Admin;
[Route("api/[controller]")]
[ApiController]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;
    private readonly IEmployeeAccountService _employeeAccountService;

    public AdminController(IAdminService adminService, IEmployeeAccountService employeeAccountService)
    {
        _adminService = adminService;
        _employeeAccountService = employeeAccountService;
    }

    [HttpGet("doctors")]
    //[Authorize(Roles = "admin")]
    public async Task<ApiResponse<List<ResponseDoctorDTO>>> GetAllDoctors()
    {
        var result = await _employeeAccountService.GetAllDoctorsAsync();
        if (!result.IsSuccess)
            return new ApiResponse<List<ResponseDoctorDTO>>(400, result.Message);

        return new ApiResponse<List<ResponseDoctorDTO>>(200, result.Message, result.Data);
    }
}
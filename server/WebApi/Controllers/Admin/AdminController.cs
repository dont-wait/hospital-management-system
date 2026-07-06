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
    private readonly IUserAccountService _userAccountService;

    public AdminController(IAdminService adminService, IEmployeeAccountService employeeAccountService, IUserAccountService userAccountService)
    {
        _adminService = adminService;
        _employeeAccountService = employeeAccountService;
        _userAccountService = userAccountService;
    }

    [HttpGet("patients")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> GetAllPatientsAsync()
    {
        var result = await _userAccountService.GetAllPatientsAsync();

        if (!result.IsSuccess)
            return new JsonResult(new ApiResponse<List<ResponseUserDTO>>(404, result.Message)) { StatusCode = 404 };

        return new JsonResult(new ApiResponse<List<ResponseUserDTO>>(200, "Lấy danh sách bệnh nhân thành công", result.Data)) { StatusCode = 200 };
    }
}

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
}
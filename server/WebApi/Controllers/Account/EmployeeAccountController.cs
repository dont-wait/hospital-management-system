using Microsoft.AspNetCore.Mvc;
using HospitalManagementSystem.DTOs.UserAccount;
using HospitalManagementSystem.Services.Account;
using Utils;
using Microsoft.AspNetCore.Authorization;

namespace HospitalManagementSystem.Controllers.Auth;
[Route("api/[controller]")]
[ApiController]
public class EmployeeController : ControllerBase
{
    private readonly IEmployeeAccountService _employeeAccountService;

    public EmployeeController(IEmployeeAccountService employeeAccountService)
    {
        _employeeAccountService = employeeAccountService;
    }

    [HttpGet("{employeeId}")]
    [Authorize(Roles = "admin")]
    public async Task<ApiResponse<ResponseUserDTO>> GetUserById(Guid employeeId)
    {
        try
        {
            var result = await _employeeAccountService.GetEmployeeByIdAsync(employeeId);
            if (result.IsSuccess)
                return new ApiResponse<ResponseUserDTO>(200, "Lấy thông tin tài khoản thành công.", result.Data);
            else
                return new ApiResponse<ResponseUserDTO>(404, result.Message);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new ApiResponse<ResponseUserDTO>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.");
        }
    }
}
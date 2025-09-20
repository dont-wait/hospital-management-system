using Microsoft.AspNetCore.Mvc;
using HospitalManagementSystem.DTOs.UserAccount;
using HospitalManagementSystem.DTOs.Patient;
using Utils;
using HospitalManagementSystem.Services.Account;
using Microsoft.AspNetCore.Authorization;
using HospitalManagementSystem.Enums.Role;

namespace HospitalManagementSystem.Controllers.Auth;

[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly IUserAccountService _userAccountService;
    private readonly IEmployeeAccountService _employeeAccountService;

    public AccountController(IUserAccountService userAccountService, IEmployeeAccountService employeeAccountService)
    {
        _userAccountService = userAccountService;
        _employeeAccountService = employeeAccountService;
    }

    [HttpGet("{patientId}")]
    [Authorize(Roles = "admin")]
    public async Task<ApiResponse<ResponseUserDTO>> GetUserById(Guid patientId)
    {
        try
        {
            var result = await _userAccountService.GetUserAccountByIdAsync(patientId);
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

    [HttpGet("@me")]
    [Authorize]
    public async Task<ApiResponse<ResponseUserDTO>> GetCurrentUser()
    {
        try
        {
            var currentUserId = _userAccountService.CurrentUserId;

            if (currentUserId == null)
                return new ApiResponse<ResponseUserDTO>(401, "Người dùng chưa đăng nhập.");

            ServiceResult<ResponseUserDTO?> result = _userAccountService.RoleId switch
            {
                nameof(RoleEnum.doctor) => await _employeeAccountService.GetEmployeeByIdAsync(currentUserId.Value),
                _ => await _userAccountService.GetUserAccountByIdAsync(currentUserId.Value),
            };

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

    //[HttpGet("{employeeId}")] for search info about employee
}
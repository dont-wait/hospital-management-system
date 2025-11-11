using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Application.Common.Utils;

namespace WebApi.Controllers.Account;

[Route("api/employees")]
[ApiController]
public class EmployeeController : ControllerBase
{
    private readonly IEmployeeAccountService _employeeAccountService;
    private readonly IUserAccountService _userAccountService;

    public EmployeeController(IEmployeeAccountService employeeAccountService, IUserAccountService userAccountService)
    {
        _employeeAccountService = employeeAccountService;
        _userAccountService = userAccountService;
    }

    [HttpGet("{employeeId}")]
    [Authorize(Roles = "admin, manager")]
    public async Task<ApiResponse<ResponseUserDTO>> GetEmployeeById(Guid employeeId)
    {
        try
        {
            var result = await _employeeAccountService.GetEmployeeByIdAsync(employeeId);
            if (result.IsSuccess)
                return new ApiResponse<ResponseUserDTO>(200, "Lấy thông tin tài khoản thành công.", result.Data);
            return new ApiResponse<ResponseUserDTO>(404, result.Message);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new ApiResponse<ResponseUserDTO>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.");
        }
    }

    [HttpGet]
    [Authorize(Roles = "admin")]
    public async Task<ApiResponse<List<ResponseUserDTO>>> GetAllEmployeesByRoleIdAsync(string role)
    {
        var result = await _employeeAccountService.GetAllEmployeesByRoleIdAsync(role);
        if (!result.IsSuccess)
            return new ApiResponse<List<ResponseUserDTO>>(400, result.Message);

        return new ApiResponse<List<ResponseUserDTO>>(200, "Lấy danh sách bác sĩ thành công", result.Data);
    }

    [HttpPut("{employeeId}")]
    [Authorize(Roles = "admin, doctor")]
    public async Task<ApiResponse<ResponseEmployeeDTO>> UpdateEmployeeById(Guid employeeId, RequestUpdateEmployeeDTO request)
    {
        string currentUserRole = _userAccountService.RoleId;

        if (!_userAccountService.CurrentUserId.HasValue)
            return new ApiResponse<ResponseEmployeeDTO>(401, "Không thể xác định người dùng hiện tại.");

        Guid currentUserId = _userAccountService.CurrentUserId.Value;

        if (currentUserRole != "admin" && currentUserId != employeeId)
            return new ApiResponse<ResponseEmployeeDTO>(403, "Bạn không có quyền thực hiện hành động này.");

        try
        {
            ServiceResult<ResponseEmployeeDTO> result = await _employeeAccountService.UpdateEmployeeAsync(employeeId, request, currentUserRole);
            if (result.IsSuccess)
                return new ApiResponse<ResponseEmployeeDTO>(200, "Cập nhật thông tin tài khoản thành công.", result.Data);

            return new ApiResponse<ResponseEmployeeDTO>(400, result.Message);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new ApiResponse<ResponseEmployeeDTO>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.");
        }
    }

    [HttpDelete("{roleId}/{employeeId}")]
    [Authorize(Roles = "admin")]
    public async Task<ApiResponse<string>> DeleteEmployeeById(Guid employeeId)
    {
        try
        {
            var result = await _employeeAccountService.DeleteEmployeeByIdAsync(employeeId);
            if (result.IsSuccess)
                return new ApiResponse<string>(200, "Xóa tài khoản nhân viên thành công.", null);
            return new ApiResponse<string>(404, result.Message);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new ApiResponse<string>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.");
        }
    }
}
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

    [HttpGet("{employeeId}", Name = "emp-id")]
    [Authorize(Roles = "admin, manager")]
    public async Task<IActionResult> GetEmployeeById(Guid employeeId)
    {
        try
        {
            var result = await _employeeAccountService.GetEmployeeByIdAsync(employeeId);
            if (result.IsSuccess)
                return new JsonResult(new ApiResponse<ResponseUserDTO>(200, "Lấy thông tin tài khoản thành công.", result.Data)) { StatusCode = 200 };
            return new JsonResult(new ApiResponse<ResponseUserDTO>(404, result.Message)) { StatusCode = 404 };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new JsonResult(new ApiResponse<ResponseUserDTO>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.")) { StatusCode = 500 };
        }
    }

    [HttpGet]
    [Authorize(Roles = "admin, hod")]
    public async Task<IActionResult> GetAllEmployeesAsync(string? role, int? departmentId)
    {
        var result = await _employeeAccountService.GetAllEmployeesAsync(role, departmentId);
        if (!result.IsSuccess)
            return new JsonResult(new ApiResponse<List<ResponseUserDTO>>(400, result.Message)) { StatusCode = 400 };
        return new JsonResult(new ApiResponse<List<ResponseUserDTO>>(200, "Lấy danh sách nhân viên thành công", result.Data)) { StatusCode = 200 };
    }

    [HttpPut("{employeeId}")]
    [Authorize(Roles = "admin, doctor")]
    public async Task<IActionResult> UpdateEmployeeById(Guid employeeId, RequestUpdateEmployeeDTO request)
    {
        string currentUserRole = _userAccountService.RoleId;

        if (!_userAccountService.CurrentUserId.HasValue)
            return new JsonResult(new ApiResponse<ResponseEmployeeDTO>(401, "Không thể xác định người dùng hiện tại.")) { StatusCode = 401 };

        Guid currentUserId = _userAccountService.CurrentUserId.Value;

        if (currentUserRole != "admin" && currentUserId != employeeId)
            return new JsonResult(new ApiResponse<ResponseEmployeeDTO>(403, "Bạn không có quyền thực hiện hành động này.")) { StatusCode = 403 };

        try
        {
            ServiceResult<ResponseEmployeeDTO> result = await _employeeAccountService.UpdateEmployeeAsync(employeeId, request, currentUserRole);
            if (result.IsSuccess)
                return new JsonResult(new ApiResponse<ResponseEmployeeDTO>(200, "Cập nhật thông tin tài khoản thành công.", result.Data)) { StatusCode = 200 };

            return new JsonResult(new ApiResponse<ResponseEmployeeDTO>(400, result.Message)) { StatusCode = 400 };
        }
        catch
        {
            return new JsonResult(new ApiResponse<ResponseEmployeeDTO>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.")) { StatusCode = 500 };
        }
    }

    [HttpDelete("{employeeId}", Name = "emp-id")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> DeleteEmployeeById(Guid employeeId)
    {
        try
        {
            var result = await _employeeAccountService.DeleteEmployeeByIdAsync(employeeId);
            if (result.IsSuccess)
                return new JsonResult(new ApiResponse<string>(200, "Xóa tài khoản nhân viên thành công.", null)) { StatusCode = 200 };
            return new JsonResult(new ApiResponse<string>(404, result.Message)) { StatusCode = 404 };
        }
        catch
        {
            return new JsonResult(new ApiResponse<string>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.")) { StatusCode = 500 };
        }
    }
}
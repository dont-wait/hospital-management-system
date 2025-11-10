using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Application.Common.Utils;

namespace WebApi.Controllers.Account;

[Route("api/[controller]")]
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
    [Authorize(Roles = "admin")]
    public async Task<ApiResponse<ResponseUserDTO>> GetUserById(Guid employeeId)
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

    [HttpPut("doctor/{doctorId}")]
    [Authorize(Roles = "admin, doctor")]
    public async Task<ApiResponse<ResponseDoctorDTO>> UpdateDoctorById(Guid doctorId, RequestUpdateDoctorDTO request)
    {
        string currentUserRole = _userAccountService.RoleId;

        if (!_userAccountService.CurrentUserId.HasValue)
            return new ApiResponse<ResponseDoctorDTO>(401, "Không thể xác định người dùng hiện tại.");

        Guid currentUserId = _userAccountService.CurrentUserId.Value;

        if (currentUserRole != "admin" && currentUserId != doctorId)
            return new ApiResponse<ResponseDoctorDTO>(403, "Bạn không có quyền thực hiện hành động này.");

        try
        {
            ServiceResult<ResponseDoctorDTO> result = await _employeeAccountService.UpdateUserAccount_Doctor_Async(doctorId, request);
            if (result.IsSuccess)
                return new ApiResponse<ResponseDoctorDTO>(200, "Cập nhật thông tin tài khoản thành công.", result.Data);

            return new ApiResponse<ResponseDoctorDTO>(400, result.Message);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new ApiResponse<ResponseDoctorDTO>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.");
        }
    }

    [HttpDelete("{employeeId}")]
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
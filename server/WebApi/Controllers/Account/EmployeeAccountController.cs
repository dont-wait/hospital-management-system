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
    public async Task<ApiResponse<ResponseUpdateDoctorDTO>> UpdateDoctorById(Guid doctorId, RequestUpdateDoctorDTO request)
    {
        string currentUserRole = _userAccountService.RoleId;
        
        if (!_userAccountService.CurrentUserId.HasValue)
            return new ApiResponse<ResponseUpdateDoctorDTO>(401, "Không thể xác định người dùng hiện tại.");
            
        Guid currentUserId = _userAccountService.CurrentUserId.Value;

        if (currentUserRole != "admin" && currentUserId != doctorId)
            return new ApiResponse<ResponseUpdateDoctorDTO>(403, "Bạn không có quyền thực hiện hành động này.");

        try
        {
            ServiceResult<ResponseUpdateDoctorDTO> result = await _employeeAccountService.UpdateUserAccount_Doctor_Async(doctorId, request);
            if (result.IsSuccess)
                return new ApiResponse<ResponseUpdateDoctorDTO>(200, "Cập nhật thông tin tài khoản thành công.", result.Data);

            return new ApiResponse<ResponseUpdateDoctorDTO>(400, result.Message);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new ApiResponse<ResponseUpdateDoctorDTO>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.");
        }
    }
}
using Application.Common.DTOs.Patient;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Application.Common.Utils;
using Domain.Enums;

namespace WebApi.Controllers.Account;
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
    [Authorize(Roles = "admin, doctor")]
    public async Task<IActionResult> GetUserById(Guid patientId)
    {
        try
        {
            var result = await _userAccountService.GetUserAccountByIdAsync(patientId);
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

    [HttpGet("@me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        try
        {
            var currentUserId = _userAccountService.CurrentUserId;

            if (currentUserId == null)
                return new JsonResult(new ApiResponse<ResponseUserDTO>(401, "Người dùng chưa đăng nhập.")) { StatusCode = 401 };

            ServiceResult<ResponseUserDTO?> result = _userAccountService.RoleId switch
            {
                nameof(RoleEnum.doctor) => await _employeeAccountService.GetEmployeeByIdAsync(currentUserId.Value),
                _ => await _userAccountService.GetUserAccountByIdAsync(currentUserId.Value),
            };

            if (result.IsSuccess)
                return new JsonResult(new ApiResponse<ResponseUserDTO>(200, "Lấy thông tin tài khoản thành công.", result.Data)) { StatusCode = 200 };
            else
                return new JsonResult(new ApiResponse<ResponseUserDTO>(404, result.Message)) { StatusCode = 404 };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new JsonResult(new ApiResponse<ResponseUserDTO>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.")) { StatusCode = 500 };
        }
    }

    [HttpPut("patient/{patientId}")]
    [Authorize(Roles = "patient, admin")]
    public async Task<IActionResult> UpdateUserById(Guid patientId, RequestUpdatePatient request)
    {
        var currentUserRole = _userAccountService.RoleId;
        var currentUserId = _userAccountService.CurrentUserId;
        try
        {
            if (currentUserRole == "patient" && !currentUserId.Equals(patientId))
                return new JsonResult(new ApiResponse<ResponsePatientDTO>(403,
                    "Bạn không có quyền cập nhật thông tin cho người dùng này.")) { StatusCode = 403 };

            var updatedPatientAndAccount = await _userAccountService.UpdateUserAccount_Patient_Async(patientId, request);
            if (!updatedPatientAndAccount.IsSuccess)
                return new JsonResult(new ApiResponse<ResponsePatientDTO>(404, updatedPatientAndAccount.Message)) { StatusCode = 404 };

            return new JsonResult(new ApiResponse<ResponsePatientDTO>(200, "Thông tin của bạn đã được cập nhật thành công", updatedPatientAndAccount.Data)) { StatusCode = 200 };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new JsonResult(new ApiResponse<ResponsePatientDTO>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.")) { StatusCode = 500 };
        }
    }
    [HttpDelete("{patientId}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> DeletePatientById(Guid patientId)
    {
        try
        {
            var result = await _userAccountService.DeletePatientByIdAsync(patientId);
            if (result.IsSuccess)
                return new JsonResult(new ApiResponse<string>(200, "Xóa tài khoản thành công.", null)) { StatusCode = 200 };
            return new JsonResult(new ApiResponse<string>(404, result.Message)) { StatusCode = 404 };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new JsonResult(new ApiResponse<string>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.")) { StatusCode = 500 };
        }
    }
}
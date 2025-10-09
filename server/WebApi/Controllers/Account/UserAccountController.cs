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

    [HttpPut("/patient/{patientId}")]
    [Authorize(Roles = "patient")]
    public async Task<ApiResponse<ResponseUpdatePatient>> UpdateUserById(Guid patientId, RequestUpdatePatient request)
    {
        try
        {
            var updatedPatientAndAccount = await _userAccountService.UpdateUserAccount_Patient_Async(patientId, request);
            if (!updatedPatientAndAccount.IsSuccess)
                return new ApiResponse<ResponseUpdatePatient>(404, updatedPatientAndAccount.Message);

            return new ApiResponse<ResponseUpdatePatient>(200, "Thông tin của bạn đã được cập nhật thành công", updatedPatientAndAccount.Data);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new ApiResponse<ResponseUpdatePatient>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.");
        }        
    }
}
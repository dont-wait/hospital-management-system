using Application.Common.Utils;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers.Department;
[Route("api/departments")]
public class DepartmentController : ControllerBase
{
    private readonly IDepartmentService _departmentService;

    public DepartmentController(IDepartmentService departmentService)
    {
        _departmentService = departmentService;
    }

    [HttpGet]
    public async Task<ApiResponse<List<ResponseDepartmentDTO>>> GetAllDepartments()
    {
        var result = await _departmentService.GetAllDepartmentsAsync();
        if (!result.IsSuccess)
            return new ApiResponse<List<ResponseDepartmentDTO>>(400, result.Message);
        return new ApiResponse<List<ResponseDepartmentDTO>>(200, "Lấy danh sách phòng ban thành công", result.Data!);
    }
}
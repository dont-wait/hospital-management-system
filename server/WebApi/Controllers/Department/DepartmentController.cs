using Application.Common.Utils;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers.Department;
[Route("api/departments")]
public class DepartmentController : ControllerBase
{
    private readonly IDepartmentService _departmentService;
    private readonly IRoomService _roomService;

    public DepartmentController(IDepartmentService departmentService, IRoomService roomService)
    {
        _departmentService = departmentService;
        _roomService = roomService;
    }

    [HttpGet]
    public async Task<ApiResponse<List<ResponseDepartmentDTO>>> GetAllDepartments()
    {
        var result = await _departmentService.GetAllDepartmentsAsync();
        if (!result.IsSuccess)
            return new ApiResponse<List<ResponseDepartmentDTO>>(400, result.Message);
        return new ApiResponse<List<ResponseDepartmentDTO>>(200, "Lấy danh sách phòng ban thành công", result.Data!);
    }

    [HttpGet("rooms")]
    public async Task<IActionResult> GetRoomsByDepartmentId(int departmentId)
    {
        var rooms = await _roomService.GetRoomByDepartmentIdAsync(departmentId);
        if (!rooms.IsSuccess)
            return new JsonResult(new ApiResponse<List<ResponseRoom>>(400,rooms.Message, null)) { StatusCode = 400 };
        
        return new JsonResult(new ApiResponse<List<ResponseRoom>>(200, rooms.Message, rooms.Data)) { StatusCode = 200 };
    }

    [HttpGet("revenue-statistics")]
    public async Task<IActionResult> GetDepartmentRevenueStatistics(
        [FromQuery] string type,
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null)
    {
        var result = await _departmentService.GetDepartmentRevenueStatisticsAsync(type, fromDate, toDate);
        if (!result.IsSuccess)
            return new JsonResult(new ApiResponse<List<ResponseDeparmentRevenueStatisticsDTO>>(400, result.Message)) { StatusCode = 400 };

        return new JsonResult(new ApiResponse<List<ResponseDeparmentRevenueStatisticsDTO>>(200, "Lấy thống kê doanh thu phòng ban thành công", result.Data!)) { StatusCode = 200 };
    }
}
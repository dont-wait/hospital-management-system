using Application.Common.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers.Appointment;
[Route("api/appointments")]
[ApiController]
public class AppointmentController : ControllerBase
{

    private readonly ITaskItemService _taskItemService;
    private readonly IAppointmentService _appointmentService;
    public AppointmentController(ITaskItemService taskItemService, IAppointmentService appointmentService)
    {
        _taskItemService = taskItemService;
        _appointmentService = appointmentService;
    }


    [HttpDelete("{appointmentId:long}")]
    [Authorize(Roles = "admin, patient")]
    public async Task<IActionResult> DeleteAppointment(long appointmentId)
    {
        try
        {
            var result = await _appointmentService.DeleteAppointment(appointmentId);
            if (result.IsSuccess)
                return new JsonResult(new ApiResponse<string>(200, "Xóa đăng ký khám thành công", null)) { StatusCode = 200 };
            return new JsonResult(new ApiResponse<string>(400, result.Message)) { StatusCode = 400 };
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return new JsonResult(new ApiResponse<string>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.")) { StatusCode = 500 };
        }
    }
    
    [HttpPut]
    public async Task<IActionResult> UpdateAppointment(RequestAppointmentDTO request)
    {
        try
        {
            var result = await _appointmentService.UpdateAppointment(request);
            if (result.IsSuccess)
                return new JsonResult(new ApiResponse<string>(200, "Cập nhật đăng ký khám thành công", result.Data)) { StatusCode = 200 };
            return new JsonResult(new ApiResponse<string>(400, result.Message)) { StatusCode = 400 };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new JsonResult(new ApiResponse<string>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.")) { StatusCode = 500 };
        }
    }
    
    [HttpGet]
    public async Task<IActionResult> GetAppointments([FromQuery] string? status, 
                                                    [FromQuery] Guid? patientId,
                                                    [FromQuery] int page = 1,
                                                    [FromQuery] int size = 3
        )
    {
        try
        {
            var result = await _appointmentService.GetAppointments(status, patientId, page, size);
            if (result.IsSuccess)
                return Ok(new
                {
                    status = 200,
                    message = "Lấy danh sách đăng ký khám thành công",
                    data = result.Data,
                    page,
                    size,
                    totalPages = (int)Math.Ceiling((double)result.Data.Count / size)
                });
            return new JsonResult(new ApiResponse<string>(400, result.Message)) { StatusCode = 400 };
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return new JsonResult(new ApiResponse<List<ResponseAppointmentDTO>>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.")) { StatusCode = 500 };
        }
    }

    [HttpGet("{appointmentId:long}")]
    public async Task<IActionResult> GetAppointmentByIdAsync(long appointmentId)
    {
        try
        {
            var result = await _appointmentService.GetAppointmentByIdAsync(appointmentId);
            if (result.IsSuccess)
                return new JsonResult(new ApiResponse<ResponseAppointmentDTO>(200, "Lấy thông tin đăng ký khám thành công", result.Data)) { StatusCode = 200 };
            return new JsonResult(new ApiResponse<ResponseAppointmentDTO>(400, result.Message)) { StatusCode = 400 };
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return new JsonResult(new ApiResponse<ResponseAppointmentDTO>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.")) { StatusCode = 500 };
        }
    }
    
    [HttpPost]
    [Authorize(Roles = "admin, doctor, patient, nurse")]
    public async Task<IActionResult> CreateAppointment(RequestAppointmentDTO request)
    {
        try
        {
            var result = await _appointmentService.CreateAppointment(request);
            if (result.IsSuccess)
                return new JsonResult(new ApiResponse<string>(201, "Đăng ký khám thành công", result.Data)) { StatusCode = 201 };
            return new JsonResult(new ApiResponse<string>(400, result.Message)) { StatusCode = 400 };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new JsonResult(new ApiResponse<string>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.")) { StatusCode = 500 };
        }
    }

    [HttpGet("available-slots")]
    [Authorize(Roles = "admin, doctor, patient, nurse")]
    public async Task<IActionResult> GetAvailableAppointments([FromQuery (Name = "d")] DateOnly? date,
                                                            [FromQuery (Name = "dp-id")] int? departmentId,
                                                            [FromQuery (Name = "doc-id")] Guid? doctorId)
    {
        try
        {
            var result = await _taskItemService.GetAvailableAppointments(date,
                departmentId,
                doctorId);
            if (result.IsSuccess)
                return new JsonResult(new ApiResponse<ResponseAvailableAppointment>(200, "Lấy danh sách đăng ký khám hợp lệ thành công", result.Data)) { StatusCode = 200 };
            return new JsonResult(new ApiResponse<string>(400, result.Message)) { StatusCode = 400 };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new JsonResult(new ApiResponse<string>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.")) { StatusCode = 500 };
        }
    }
}
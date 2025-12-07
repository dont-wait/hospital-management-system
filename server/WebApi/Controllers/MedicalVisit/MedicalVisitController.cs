using Application.Common.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/medical-visits")]
public class MedicalVisitController : ControllerBase
{
    private readonly IMedicalVisitService _medicalVisitService;
    public MedicalVisitController(IMedicalVisitService medicalVisitService)
    {
        _medicalVisitService = medicalVisitService;
    }

    [HttpPost]
    [Authorize(Roles = "admin, doctor, hod")]
    public async Task<IActionResult> CreateMedicalVisit(RequestMedicalVisitDTO request)
    {
        try
        {
            var result = await _medicalVisitService.CreateMedicalVisitAsync(request);
            if (result.IsSuccess)
                return new JsonResult(new ApiResponse<ResponseMedicalVisitDTO>(201, "Ghi nhận chuẩn đoán thành công", result.Data)) { StatusCode = 201 };
            return new JsonResult(new ApiResponse<string>(400, result.Message)) { StatusCode = 400 };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new JsonResult(new ApiResponse<string>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.")) { StatusCode = 500 };
        }
    }
    
    [HttpGet("{medicalVisitId}")]
    [Authorize(Roles = "admin, doctor, hod, patient")]
    public async Task<IActionResult> GetMedicalVisitById(long medicalVisitId)
    {
        try
        {
            var result = await _medicalVisitService.GetMedicalVisitByIdAsync(medicalVisitId);
            if (result.IsSuccess)
                return new JsonResult(new ApiResponse<ResponseMedicalVisitDTO?>(200, "Lấy thông tin chuẩn đoán thành công", result.Data)) { StatusCode = 200 };
            return new JsonResult(new ApiResponse<string>(404, result.Message)) { StatusCode = 404 };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new JsonResult(new ApiResponse<string>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.")) { StatusCode = 500 };
        }
    }

    [HttpGet("patient/{patientId}")]
    [Authorize(Roles = "admin, doctor, hod, patient")]
    public async Task<IActionResult> GetMedicalVisitsByPatientId(Guid patientId)
    {
        try
        {
            var result = await _medicalVisitService.GetMedicalVisitsByPatientIdAsync(patientId);
            if (result.IsSuccess)
                return new JsonResult(new ApiResponse<List<ResponseMedicalVisitDTO>>(200, "Lấy thông tin chuẩn đoán thành công", result.Data)) { StatusCode = 200 };
            return new JsonResult(new ApiResponse<string>(404, result.Message)) { StatusCode = 404 };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new JsonResult(new ApiResponse<string>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.")) { StatusCode = 500 };
        }
    }
}
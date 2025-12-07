using Application.Common.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/prescriptions")]
public class PrescriptionController : ControllerBase
{
    private readonly IPrescriptionService _prescriptionService;
    public PrescriptionController(IPrescriptionService prescriptionService)
    {
        _prescriptionService = prescriptionService;
    }
    
    [HttpPost]
    [Authorize(Roles = "admin, doctor, hod")]
    public async Task<IActionResult> CreatePrescription(RequestPrescriptionDTO request)
    {
        try
        {
            var result = await _prescriptionService.CreatePrescriptionAsync(request);
            if (result.IsSuccess)
                return new JsonResult(new ApiResponse<ResponsePrescriptionDTO>(201, "Tạo đơn thuốc thành công", result.Data)) { StatusCode = 201 };
            return new JsonResult(new ApiResponse<string>(400, result.Message)) { StatusCode = 400 };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new JsonResult(new ApiResponse<string>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.")) { StatusCode = 500 };
        }
    }
    
    [HttpGet("{prescriptionId}")]
    [Authorize(Roles = "admin, doctor, hod, patient")]
    
    public async Task<IActionResult> GetPrescriptionById(long prescriptionId)
    {
        try
        {
            var result = await _prescriptionService.GetPrescriptionByIdAsync(prescriptionId);
            if (result.IsSuccess)
                return new JsonResult(new ApiResponse<ResponsePrescriptionDTO?>(200, "Lấy thông tin đơn thuốc thành công", result.Data)) { StatusCode = 200 };
            return new JsonResult(new ApiResponse<string>(404, result.Message)) { StatusCode = 404 };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new JsonResult(new ApiResponse<string>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.")) { StatusCode = 500 };
        }
    }
    
    [HttpGet("medical-visit/{medicalVisitId}")]
    [Authorize(Roles = "admin, doctor, hod, patient")]
    public async Task<IActionResult> GetPrescriptionsByMedicalVisitId(long medicalVisitId)
    {
        try
        {
            var result = await _prescriptionService.GetPrescriptionsByMedicalVisitIdAsync(medicalVisitId);
            if (result.IsSuccess)
                return new JsonResult(new ApiResponse<List<ResponsePrescriptionDTO>>(200, "Lấy danh sách đơn thuốc thành công", result.Data)) { StatusCode = 200 };
            return new JsonResult(new ApiResponse<string>(404, result.Message)) { StatusCode = 404 };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new JsonResult(new ApiResponse<string>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.")) { StatusCode = 500 };
        }
    }
    
    [HttpGet("patient/{patientId}")]
    public async Task<IActionResult> GetPrescriptionsByPatientId(Guid patientId)
    {
        try
        {
            var result = await _prescriptionService.GetPrescriptionsByPatientIdAsync(patientId);
            if (result.IsSuccess)
                return new JsonResult(new ApiResponse<List<ResponsePrescriptionDTO>>(200, "Lấy danh sách đơn thuốc của bệnh nhân thành công", result.Data)) { StatusCode = 200 };
            return new JsonResult(new ApiResponse<string>(404, result.Message)) { StatusCode = 404 };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return new JsonResult(new ApiResponse<string>(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.")) { StatusCode = 500 };
        }
    }
}
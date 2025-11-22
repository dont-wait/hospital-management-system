using Microsoft.AspNetCore.Hosting;

namespace Infrastructure.Services.Email;
public class SendEmailTemplateService : IEmailTemplateService
{

    private readonly IEmailService _emailProvider;
    private readonly IWebHostEnvironment _env;
    private string? _emailTemplate;
    
    
    public SendEmailTemplateService(IEmailService emailProvider, IWebHostEnvironment env)
    {
        _emailProvider = emailProvider;
        _env = env;
    }
    
    public async Task SendConfirmedAppointmentEmailAsync(string to, ResponseAppointmentDTO responseAppointmentDTO)
    {
        var emailTemplatePath = Path.Combine(_env.ContentRootPath, "Resources", "EmailTemplates", "ConfirmedAppointmentTemplate.html");
        _emailTemplate = File.ReadAllText(emailTemplatePath);
        
        var genderText = responseAppointmentDTO.Gender?.ToLower() switch
        {
            "m" => "Nam",
            "f" => "Nữ",
            "o" => "Khác",
            _ => "Chưa xác định"
        };
        
        string body = _emailTemplate
            .Replace("{{PatientName}}", responseAppointmentDTO.FullName)
            .Replace("{{AppointmentId}}", responseAppointmentDTO.AppointmentId.ToString())
            .Replace("{{BillingId}}", responseAppointmentDTO.BillingId.ToString())
            .Replace("{{DoctorName}}", responseAppointmentDTO.DoctorName)
            .Replace("{{DepartmentName}}", responseAppointmentDTO.DepartmentName)
            .Replace("{{RoomName}}", responseAppointmentDTO.RoomName)
            .Replace("{{AppointmentDate}}", responseAppointmentDTO.AppointmentDate.ToString("dd/MM/yyyy"))
            .Replace("{{StartTime}}", responseAppointmentDTO.AppointmentStartTime.ToString("HH:mm"))
            .Replace("{{EndTime}}", responseAppointmentDTO.AppointmentEndTime.ToString("HH:mm"))
            .Replace("{{DateOfBirth}}", responseAppointmentDTO.DateOfBirth.HasValue
                ? responseAppointmentDTO.DateOfBirth.Value.ToString("dd/MM/yyyy")
                : "Chưa có thông tin")
            .Replace("{{Gender}}", genderText)
            .Replace("{{PriceOfService}}", FormatUtil.FormatCurrency(responseAppointmentDTO.PriceOfService))
            .Replace("{{AppointmentUrl}}", $"http://localhost:3000/appointments/{responseAppointmentDTO.AppointmentId}"); //TODO: fix sau
        await _emailProvider.SendEmailAsync(to, "Thông tin xác nhận", body, true);
    }
    
}
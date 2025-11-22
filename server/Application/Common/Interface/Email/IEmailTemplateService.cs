public interface IEmailTemplateService
{
    Task SendConfirmedAppointmentEmailAsync(string to, ResponseAppointmentDTO responseAppointmentDto);
}
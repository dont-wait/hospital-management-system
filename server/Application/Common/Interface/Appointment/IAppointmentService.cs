using Application.Common.Utils;
public interface IAppointmentService
{
    Task<ServiceResult<string>> CreateAppointment(RequestAppointmentDTO createAppointmentDto);
    Task<ServiceResult<List<ResponseAppointmentDTO>>> GetAppointments(string? status, Guid? patientId);
    Task<ServiceResult<string>> UpdateAppointment(RequestAppointmentDTO updateAppointmentDto);
    Task<ServiceResult<string>> DeleteAppointment(long appointmentId);
    Task<ServiceResult<ResponseAppointmentDTO>> GetAppointmentByIdAsync(long appointmentId);
}
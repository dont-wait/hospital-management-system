using Application.Common.DTOs;
using Application.Common.Utils;
public interface IAppointmentService
{
    Task<ServiceResult<string>> CreateAppointment(RequestAppointmentDTO createAppointmentDto);
    Task<ServiceResult<PaginatedResult<ResponseAppointmentDTO>>> GetAppointments(string? status, Guid? patientId, int page, int size);
    Task<ServiceResult<string>> UpdateAppointment(RequestAppointmentDTO updateAppointmentDto);
    Task<ServiceResult<bool>> DeleteAppointment(long appointmentId);
    Task<ServiceResult<ResponseAppointmentDTO>> GetAppointmentByIdAsync(long appointmentId);
}
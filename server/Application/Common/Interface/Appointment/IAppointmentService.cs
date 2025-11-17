using Application.Common.Utils;

namespace Application.Common.Interface.Appointment;
public interface IAppointmentService
{
    Task<ServiceResult<ResponseAppointmentDTO>> CreateAppointmentAsync(RequestAppointmentDTO appointmentDto);

    Task<ServiceResult<ResponseAppointmentDTO?>> GetAppointmentByIdAsync(Guid appointmentId);
    Task<ServiceResult<ResponseAppointmentDTO>> UpdateAppointmentAsync(Guid appointmentId, RequestUpdateAppointmentDTO appointmentDto);
    Task<ServiceResult<string>> DeleteAppointmentAsync(Guid appointmentId);
}

using Application.Common.Utils;
public interface IAppointmentService
{
    Task<ServiceResult<ResponseAppointmentDTO>> CreateAppointment(RequestAppointmentDTO createAppointmentDto);
}
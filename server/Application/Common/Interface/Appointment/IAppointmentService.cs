using Application.Common.Utils;
public interface IAppointmentService
{
    Task<ServiceResult<string>> CreateAppointment(RequestAppointmentDTO createAppointmentDto);
}
public interface IAppointmentMapper
{
    ResponseAppointmentDTO ToResponseDTO(Appointment appointment);
    Appointment ToEntity(RequestAppointmentDTO appointmentDto);
    void UpdateEntity(Appointment appointment, RequestUpdateAppointmentDTO appointmentDto);
}
public class AppointmentMapper : IAppointmentMapper
{
    public Appointment ToEntity(RequestAppointmentDTO appointmentDto)
    {
        return new Appointment
        {
            PatientId = appointmentDto.PatientId,
            AppointmentDate = appointmentDto.AppointmentDate,
            DoctorId = appointmentDto.DoctorId,
            DoctorScheduleId = appointmentDto.DoctorScheduleId,
            ServiceId = appointmentDto.ServiceId,
            DepartmentId = appointmentDto.DepartmentId,
            AppointmentStatus = appointmentDto.AppointmentStatus ?? ""
        };
    }

    public ResponseAppointmentDTO ToResponseDTO(Appointment appointment)
    {
        return new ResponseAppointmentDTO
        {
            Id = appointment.Id,
            PatientId = appointment.PatientId,
            AppointmentDate = appointment.AppointmentDate,
            DoctorId = appointment.DoctorId,
            DoctorScheduleId = appointment.DoctorScheduleId,
            DepartmentId = appointment.DepartmentId,
            ServiceId = appointment.ServiceId,
            AppointmentStatus = appointment.AppointmentStatus
        };
    }

    public void UpdateEntity(Appointment appointment, RequestUpdateAppointmentDTO appointmentDto)
    {
        appointment.AppointmentDate = appointmentDto.AppointmentDate;
        appointment.DoctorId = appointmentDto.DoctorId;
        appointment.DoctorScheduleId = appointmentDto.DoctorScheduleId;
        appointment.ServiceId = appointmentDto.ServiceId;
        appointment.DepartmentId = appointmentDto.DepartmentId;
        appointment.AppointmentStatus = appointmentDto.AppointmentStatus ?? "";
    }
}
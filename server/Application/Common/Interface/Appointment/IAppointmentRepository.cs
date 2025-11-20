public interface IAppointmentRepository
{
    Task<bool> IsExistingAppointmentAsync(DateOnly appointmentDate, TimeOnly appointmentStartTime, TimeOnly appointmentEndTime);
    Task<Appointment> CreateAppointmentAsync(Appointment appointment); 
    Task<List<Appointment>> GetAllAppointmentsAsync();

    Task<Appointment?> GetAppointmentByIdAsync(long appointmentId);
    Task<Appointment> UpdateAppointmentAsync(Appointment appointment);

    Task<bool> DeleteAppointmentAsync(long appointmentId);
}
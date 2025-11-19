public interface IAppointmentRepository
{
    Task<bool> IsExistingAppointmentAsync(DateTime appointmentDate);
    Task<Appointment> CreateAppointmentAsync(Appointment appointment); 
    Task<List<Appointment>> GetAllAppointmentsAsync();

    Task<Appointment?> GetAppointmentByIdAsync(long appointmentId);
    Task<Appointment> UpdateAppointmentAsync(Appointment appointment);

    Task<bool> DeleteAppointmentAsync(long appointmentId);
}
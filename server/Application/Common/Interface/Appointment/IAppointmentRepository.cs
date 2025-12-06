using Application.Common.DTOs;
public interface IAppointmentRepository
{
    Task<bool> IsExistingAppointmentAsync(DateOnly appointmentDate, TimeOnly appointmentStartTime, TimeOnly appointmentEndTime);
    Task<Appointment> CreateAppointmentAsync(Appointment appointment); 
    
    Task<PaginatedResult<Appointment>> GetAllAppointmentsAsync(string ?status, Guid? patientId, Guid? doctorId, DateOnly? date, int page, int size);

    Task<Appointment?> GetAppointmentByIdAsync(long appointmentId);
    
    Task<Appointment> UpdateAppointmentAsync(Appointment appointment);

    Task<bool> DeleteAppointmentAsync(long appointmentId);
}
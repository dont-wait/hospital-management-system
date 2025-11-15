public interface IAppointmentRepository
{
    Task<bool> IsExistingAppointmentAsync(DateTime appointmentDate);
    Task<Appointment> CreateAppointmentAsync(Appointment appointment); //Appointment được tạo ở Application và gửi xuống Repository để lưu vào DB sau đó trả về Appointment đã lưu

    Task<List<Appointment>> GetAllAppointmentsAsync();

    Task<Appointment?> GetAppointmentByIdAsync(long appointmentId);
    Task<Appointment> UpdateAppointmentAsync(Appointment appointment);

    Task<bool> DeleteAppointmentAsync(long appointmentId);
}
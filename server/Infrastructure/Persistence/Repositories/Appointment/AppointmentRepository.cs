
using Microsoft.EntityFrameworkCore;

public class AppointmentRepository : IAppointmentRepository
{
    private readonly AppDbContext _context;

    public AppointmentRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Appointment> CreateAppointmentAsync(Appointment appointment)
    {
        await _context.appointments.AddAsync(appointment);
        await _context.SaveChangesAsync();
        return appointment;
    }

    public async Task<bool> DeleteAppointmentAsync(long appointmentId)
    {
        Appointment? existingAppointment = _context.appointments
        .FirstOrDefault(a => a.Id == appointmentId && a.DeletedAt == null);

        if(existingAppointment == null)
            return false;
        _context.appointments.Remove(existingAppointment);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<Appointment>> GetAllAppointmentsAsync()
    {
        return await _context.appointments
            .Where(a => a.DeletedAt == null)
            .ToListAsync();
    }

    public async Task<Appointment?> GetAppointmentByIdAsync(long appointmentId)
    {
        return await _context.appointments
            .FirstOrDefaultAsync(a => a.Id == appointmentId && a.DeletedAt == null);
    }

    public async Task<bool> IsExistingAppointmentAsync(DateOnly appointmentDate, TimeOnly appointmentStartTime, TimeOnly appointmentEndTime)
    {
        return await _context.appointments
            .AnyAsync(a => a.AppointmentDate == appointmentDate && 
                           a.AppointmentStartTime ==  appointmentStartTime && 
                           a.AppointmentEndTime == appointmentEndTime && 
                           a.DeletedAt == null);
    }

    public async Task<Appointment> UpdateAppointmentAsync(Appointment appointment)
    {
        _context.appointments.Update(appointment);
        await _context.SaveChangesAsync();
        return appointment;
    }
}

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
    public async Task<List<Appointment>> GetAllAppointmentsAsync(string? status, Guid? patientId, int page , int size)
    {
        
        if (page < 1) page = 1;
        if (size < 1) size = 10;
        var query = _context.appointments
            .Include(r => r.Room)
            .ThenInclude(r => r.Department)
            .Include(b => b.Billing)
            .Include(p => p.Patient)
            .Include(d => d.Doctor)
            .ThenInclude(e => e!.Employee)
            .Where(a => a.DeletedAt == null)
            .AsQueryable();

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(a => a.AppointmentStatus.ToString() == status);
        }

        if (patientId.HasValue)
        {
            query = query.Where(a => a.PatientId == patientId.Value);
        }

        int totalRecords = await query.CountAsync();
        int totalPages = (int)Math.Ceiling((double)totalRecords / size);
        
        var appointments = await query.OrderByDescending(a => a.AppointmentDate)
            .Skip((page - 1)  * size)
            .Take(size)
            .ToListAsync();

        return appointments;
    }

    public async Task<bool> DeleteAppointmentAsync(long appointmentId)
    {
        Appointment? existingAppointment = _context.appointments
            .Include(r => r.Room)
            .ThenInclude(r => r.Department)
            .Include(s => s.SlotTime)
            .Include(b => b.Billing)
            .Include(p => p.Patient)
            .Include(d => d.Doctor)
            .ThenInclude(e => e!.Employee)
            .FirstOrDefault(a => a.Id == appointmentId && a.DeletedAt == null);

        if (existingAppointment == null)
            return false;


        var slot = await _context.slot_times
            .FirstOrDefaultAsync(s => s.Id == existingAppointment!.SlotTimeId); // Replace SlotTimeId with your property

        if (slot != null && slot.CurrentAppointments > 0)
        {
            slot.CurrentAppointments--;   
        }
        
        _context.appointments.Remove(existingAppointment);
        _context.billings.Remove(existingAppointment.Billing);
        
        await _context.SaveChangesAsync();
        
        return true;
    }

    public async Task<Appointment?> GetAppointmentByIdAsync(long appointmentId)
    {
        return await _context.appointments
            .Include(r => r.Room)
                .ThenInclude(r => r.Department)
            .Include(b => b.Billing)
            .Include(p => p.Patient)
            .Include(d => d.Doctor)
                .ThenInclude(e => e!.Employee)
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
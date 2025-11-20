using Domain.Enums;
using Microsoft.EntityFrameworkCore;
public class SlotTimeRepository : ISlotTimeRepository
{

    private readonly AppDbContext _context;

    public SlotTimeRepository(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<bool?> IsAvailableSlotTimeForBookAsync(long slotTimeId)
    {
        return await _context.slot_times
            .AnyAsync(st => st.Id == slotTimeId && 
                       st.DeletedAt == null && 
                       st.SlotStatus == SlotStatusEnum.Opened.ToString() && 
                       st.CurrentAppointments < st.MaxAppointments);
        
    }
    public void UpdateAsync(SlotTime slotTime)
    {
        _context.slot_times.Update(slotTime);
        _context.SaveChanges();
    }

}
using Microsoft.EntityFrameworkCore;

public class RoomRepository : IRoomRepository
{
    private readonly AppDbContext _context;

    public RoomRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Room>> GetRoomByDepartmentIdAsync(int departmentId)
    {
        return await _context.rooms
            .Where(r => r.DepartmentId == departmentId)
            .ToListAsync();
    }
}
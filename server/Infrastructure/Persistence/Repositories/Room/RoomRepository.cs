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

    public async Task<Room?> GetByNameAsync(string name)
    {
        return await _context.rooms
            .FirstOrDefaultAsync(r => r.Name == name);
    }
}
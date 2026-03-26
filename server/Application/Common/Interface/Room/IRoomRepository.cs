public interface IRoomRepository
{
    Task<List<Room>> GetRoomByDepartmentIdAsync(int departmentId);
    Task<Room?> GetByNameAsync(string name);
}
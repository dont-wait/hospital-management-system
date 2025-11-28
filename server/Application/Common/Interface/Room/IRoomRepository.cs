public interface IRoomRepository
{
    Task<List<Room>> GetRoomByDepartmentIdAsync(int departmentId);
}
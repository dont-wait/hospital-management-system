using Application.Common.Utils;

public class RoomService : IRoomService
{
    private readonly IRoomRepository _roomRepository;
    public RoomService(IRoomRepository roomRepository)
    {
        _roomRepository = roomRepository;
    }

    public async Task<ServiceResult<List<ResponseRoom>>> GetRoomByDepartmentIdAsync(int departmentId)
    {
        if (departmentId <= 0)
        {
            return ServiceResult<List<ResponseRoom>>.Fail("DepartmentId không hợp lệ");
        }
        List<Room> rooms = await _roomRepository.GetRoomByDepartmentIdAsync(departmentId);
        List<ResponseRoom> responseRooms = rooms.Select(r => new ResponseRoom
        {
            Id = r.Id,
            Name = r.Name,
            Capacity = r.Capacity
        }).ToList();

        return ServiceResult<List<ResponseRoom>>.Success(responseRooms);
    }
}
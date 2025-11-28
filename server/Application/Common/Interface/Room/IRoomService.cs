using Application.Common.Utils;

public interface IRoomService
{
    Task<ServiceResult<List<ResponseRoom>>> GetRoomByDepartmentIdAsync(int departmentId);
}
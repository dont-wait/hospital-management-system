using Application.Common.Utils;

public interface IDepartmentService
{
    Task<ServiceResult<List<ResponseDepartmentDTO>>> GetAllDepartmentsAsync();
}
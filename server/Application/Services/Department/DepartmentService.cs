using Application.Common.Utils;

public class DepartmentService : IDepartmentService
{
    private readonly IDepartmentRepository _departmentRepository;

    public DepartmentService(IDepartmentRepository departmentRepository)
    {
        _departmentRepository = departmentRepository;
    }

    public async Task<ServiceResult<List<ResponseDepartmentDTO>>> GetAllDepartmentsAsync()
    {
        var departments = await _departmentRepository.GetAllDepartmentsAsync();

        if (departments == null || !departments.Any())
        {
            return ServiceResult<List<ResponseDepartmentDTO>>.Fail("Departments not found");
        }

        var departmentDTOs = departments.Select(d => new ResponseDepartmentDTO
        {
            DepartmentId = d.Id,
            DepartmentName = d.Name,
            DepartmentLocation = d.Location,
            DepartmentDescription = d.Description
        }).ToList();

        return ServiceResult<List<ResponseDepartmentDTO>>.Success(departmentDTOs);
    }
}
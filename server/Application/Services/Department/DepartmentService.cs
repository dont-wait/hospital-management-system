using Application.Common.Utils;

public class DepartmentService : IDepartmentService
{
    private readonly IDepartmentRepository _departmentRepository;
    private readonly IBillingRepository _billingRepository;

    public DepartmentService(IDepartmentRepository departmentRepository, IBillingRepository billingRepository)
    {
        _departmentRepository = departmentRepository;
        _billingRepository = billingRepository;
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

    public async Task<ServiceResult<List<ResponseDeparmentRevenueStatisticsDTO>>> GetDepartmentRevenueStatisticsAsync(string type, DateTime? fromDate, DateTime? toDate)
    {
        if (string.IsNullOrEmpty(type))
        {
            return ServiceResult<List<ResponseDeparmentRevenueStatisticsDTO>>.Fail("Tham số loại là bắt buộc.");
        }

        if (type != "day" && type != "month" && type != "year" && type != "week" && type != "range")
        {
            return ServiceResult<List<ResponseDeparmentRevenueStatisticsDTO>>.Fail("Loại không hợp lệ. Các giá trị hợp lệ là: 'day', 'week', 'month', 'year', 'range'.");
        }

        var stats = await _billingRepository.GetDepartmentRevenueStatisticsAsync(type, fromDate, toDate);

        return ServiceResult<List<ResponseDeparmentRevenueStatisticsDTO>>.Success(stats);
    }
}
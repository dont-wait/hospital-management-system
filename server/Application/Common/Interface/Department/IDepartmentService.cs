using Application.Common.Utils;

public interface IDepartmentService
{
    Task<ServiceResult<List<ResponseDepartmentDTO>>> GetAllDepartmentsAsync();
    Task<ServiceResult<List<ResponseDeparmentRevenueStatisticsDTO>>> GetDepartmentRevenueStatisticsAsync(string type, DateTime? fromDate, DateTime? toDate);
    Task<byte[]> ExportDepartmentRevenueAsync(string type, DateTime? fromDate, DateTime? toDate);
}
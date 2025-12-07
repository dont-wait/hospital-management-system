using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;

public class ServiceRepository : IServiceRepository
{
    private readonly AppDbContext _context;

    public ServiceRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Service?> GetServiceByIdAsync(int serviceId)
    {
        return await _context.services
            .FirstOrDefaultAsync(s => s.Id == serviceId && s.DeletedAt == null);
    }

    public async Task<string> UpdateBillingAmountAsync(long appointmentId)
    {
        var appointmentIdParam = new SqlParameter("@AppointmentId", appointmentId);
        var resultParam = new SqlParameter
        {
            ParameterName = "@Result",
            SqlDbType = System.Data.SqlDbType.NVarChar,
            Size = 500,
            Direction = System.Data.ParameterDirection.Output
        };

        await _context.Database.ExecuteSqlRawAsync(
            "EXEC sp_UpdateBillingAmount @AppointmentId, @Result OUTPUT",
            appointmentIdParam,
            resultParam
        );

        return resultParam.Value?.ToString() ?? "Không có kết quả";
    }
}

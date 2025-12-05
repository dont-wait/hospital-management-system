using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
public class BillingRepository : IBillingRepository
{

    private readonly AppDbContext _context;

    public BillingRepository(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<Billing> CreateBillingAsync(Billing billing)
    {
        await _context.billings.AddAsync(billing);
        await _context.SaveChangesAsync();
        return billing;
    }
    public async Task<Billing?> GetBillingByIdAsync(long billingId)
    {
        return await _context.billings
            .FirstOrDefaultAsync(b => b.Id == billingId);
    }

    public async Task<List<ResponseDeparmentRevenueStatisticsDTO>> GetDepartmentRevenueStatisticsAsync(string type, DateTime? date)
    {
        var connection = _context.Database.GetDbConnection();
        await connection.OpenAsync();

        using var command = connection.CreateCommand();
        command.CommandText = "PC_GetRevenueAllDepartment";
        command.CommandType = CommandType.StoredProcedure;

        command.Parameters.Add(new SqlParameter("@Type", type));
        command.Parameters.Add(new SqlParameter("@Date", date ?? (object)DBNull.Value));

        var result = new List<ResponseDeparmentRevenueStatisticsDTO>();

        using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            result.Add(new ResponseDeparmentRevenueStatisticsDTO
            {
                Id = reader.GetInt32(reader.GetOrdinal("Id")),
                Name = reader.GetString(reader.GetOrdinal("Name")),
                TotalAppointments = reader.GetInt32(reader.GetOrdinal("total_appointments")),
                Revenue = reader.GetDecimal(reader.GetOrdinal("revenue")),
                RevenueGrowthPercentage = reader.IsDBNull(reader.GetOrdinal("revenue_growth_percentage"))
                    ? null
                    : reader.GetDecimal(reader.GetOrdinal("revenue_growth_percentage"))
            });
        }

        return result;
    }
}
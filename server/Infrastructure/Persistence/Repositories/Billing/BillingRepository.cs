using System.Data;
using Microsoft.Data.SqlClient;
using Application.Common.DTOs;
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
            .FirstOrDefaultAsync(b => b.Id == billingId && b.DeletedAt == null);
    }
    public async Task<PaginatedResult<Billing>> GetBillingsAsync(string? status, 
        Guid? patientId, 
        Guid? doctorId, 
        int page, 
        int size)
    {
        if (page < 1) page = 1;
        if (size < 1) size = 10;
        var query = _context.billings
            .Include(b => b.Appointment)
            .ThenInclude(a => a!.Patient)
            .Where(b => b.DeletedAt == null)
            .AsQueryable();

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(a => a.BillingStatus.ToString() == status);
        }

        if (patientId.HasValue)
        {
            query = query.Where(a => a.Appointment!.PatientId == patientId.Value);
        }

        int totalRecords = await query.CountAsync();
        int totalPages = (int)Math.Ceiling((double)totalRecords / size);
        
        var billings = await query.OrderByDescending(a => a.CreatedAt)
            .Skip((page - 1)  * size)
            .Take(size)
            .ToListAsync();

        return new PaginatedResult<Billing>
        {
            Items = billings,
            TotalPages = totalPages,
            CurrentPage = page,
            PageSize = size,
            TotalRecords = totalRecords
        };
    }

    public async Task<List<ResponseDeparmentRevenueStatisticsDTO>> GetDepartmentRevenueStatisticsAsync(string type, DateTime? fromDate, DateTime? toDate)
    {
        var connection = _context.Database.GetDbConnection();
        await connection.OpenAsync();

        using var command = connection.CreateCommand();
        command.CommandText = "PC_GetRevenueAllDepartment";
        command.CommandType = CommandType.StoredProcedure;

        command.Parameters.Add(new SqlParameter("@Type", type));
        command.Parameters.Add(new SqlParameter("@FromDate", SqlDbType.Date) { Value = fromDate ?? (object)DBNull.Value });
        command.Parameters.Add(new SqlParameter("@ToDate", SqlDbType.Date) { Value = toDate ?? (object)DBNull.Value });

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

    public async Task<List<ResponseLatestTransactionDTO>> GetLatestTransactionsAsync(int page, int count, DateTime? fromDate, DateTime? toDate)
    {
        var connection = _context.Database.GetDbConnection();
        await connection.OpenAsync();

        using var command = connection.CreateCommand();
        command.CommandText = "PC_GetRecentTransactions";
        command.CommandType = CommandType.StoredProcedure;

        command.Parameters.Add(new SqlParameter("@PageNumber", SqlDbType.Int) { Value = page });
        command.Parameters.Add(new SqlParameter("@PageSize", SqlDbType.Int) { Value = count });
        command.Parameters.Add(new SqlParameter("@FromDate", SqlDbType.Date) { Value = fromDate ?? (object)DBNull.Value });
        command.Parameters.Add(new SqlParameter("@ToDate", SqlDbType.Date) { Value = toDate ?? (object)DBNull.Value });

        var result = new List<ResponseLatestTransactionDTO>();

        using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            result.Add(new ResponseLatestTransactionDTO
            {
                PatientName = reader.GetString(reader.GetOrdinal("PatientName")),
                ServiceName = reader.GetString(reader.GetOrdinal("ServiceName")),
                Amount = reader.GetDecimal(reader.GetOrdinal("Amount")),
                TransactionDate = reader.GetDateTime(reader.GetOrdinal("TransactionDate")),
                Status = reader.GetString(reader.GetOrdinal("Status"))
            });
        }

        return result;
    }
}
using Microsoft.EntityFrameworkCore;

public class DepartmentRepository : IDepartmentRepository
{
    private readonly AppDbContext _context;

    public DepartmentRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Department?> GetDepartmentByIdAsync(int departmentId)
    {
        return await _context.departments.FindAsync(departmentId);
    }

    public bool isDepartmentNameExists(string departmentName)
    {
        return _context.departments.Any(d => d.Name == departmentName);
    }

    public async Task<IEnumerable<Department>> GetAllDepartmentsAsync()
    {
        return await _context.departments.ToListAsync();
    }
}
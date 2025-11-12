public interface IDepartmentRepository
{
    Task<Department?> GetDepartmentByIdAsync(int departmentId);
    bool isDepartmentNameExists(string departmentName);
    Task<IEnumerable<Department>> GetAllDepartmentsAsync();
}
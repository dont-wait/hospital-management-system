public interface IEmployeeMapper
{
    ResponseEmployeeDTO MapToDto(Employee employee);
    void Update(Employee employee, RequestUpdateEmployeeDTO request, string currentUserRole);
}

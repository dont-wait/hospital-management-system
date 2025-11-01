using Application.Common.Utils;

namespace Application.Services.Admin;

public class AdminService : IAdminService
{
    private readonly IEmployeeRepository _employeeRepository;


    public AdminService(IEmployeeRepository employeeRepository)
    {
        _employeeRepository = employeeRepository;
    }


}
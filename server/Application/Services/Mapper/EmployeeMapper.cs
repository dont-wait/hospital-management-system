using Domain.Enums;

public class EmployeeMapper : IEmployeeMapper
{
    private readonly IDoctorMapper _doctorMapper;

    public EmployeeMapper(IDoctorMapper doctorMapper)
    {
        _doctorMapper = doctorMapper;
    }

    public ResponseEmployeeDTO MapToDto(Employee employee)
    {
        if (employee.RoleId.Equals(RoleEnum.doctor.ToString(), StringComparison.CurrentCultureIgnoreCase))
        {
            return _doctorMapper.MapToDto(employee.Doctor!);
        }
        else if (employee.RoleId.Equals(RoleEnum.admin.ToString(), StringComparison.CurrentCultureIgnoreCase))
        {
            return new ResponseAdminDto
            {
                EmployeeId = employee.Id,
                FirstName = employee.FirstName,
                LastName = employee.LastName,
                PhoneNumber = employee.PhoneNumber,
                Email = employee.Email,
                CertificateNumber = employee.CertificateNumber,
                DateOfBirth = employee.DateOfBirth,
                Gender = employee.Gender,
                HireDate = employee.HireDate,
                RoleId = RoleEnum.admin.ToString().ToLower()
            };
        }
        else
        {
            return new ResponseEmployeeDTO
            {
                EmployeeId = employee.Id,
                FirstName = employee.FirstName,
                LastName = employee.LastName,
                PhoneNumber = employee.PhoneNumber,
                Email = employee.Email,
                CertificateNumber = employee.CertificateNumber,
                DateOfBirth = employee.DateOfBirth,
                Gender = employee.Gender,
                HireDate = employee.HireDate,
                RoleId = employee.RoleId
            };
        }
    }
}

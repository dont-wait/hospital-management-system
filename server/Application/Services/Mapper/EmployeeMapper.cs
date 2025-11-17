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
        if (
                employee.RoleId.Equals(RoleEnum.doctor.ToString(), StringComparison.CurrentCultureIgnoreCase)
                || employee.RoleId.Equals(RoleEnum.hod.ToString(), StringComparison.CurrentCultureIgnoreCase)
            )
        {
            return _doctorMapper.MapToDto(employee.Doctor, employee.RoleId.Equals(RoleEnum.hod.ToString(), StringComparison.CurrentCultureIgnoreCase));
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
                RoleId = RoleEnum.admin.ToString().ToLower(),
                ExperienceYears = employee.ExperienceYears,
                DepartmentName = employee.Department.Name
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

    public void Update(Employee employee, RequestUpdateEmployeeDTO request, string currentUserRole)
    {
        bool isAdmin = currentUserRole.Equals(RoleEnum.admin.ToString(), StringComparison.CurrentCultureIgnoreCase);

        employee.PhoneNumber = request.PhoneNumber;
        if (employee.UserAccount != null)
        {
            employee.UserAccount.AvatarUrl = request.AvatarUrl;
        }

        if (isAdmin)
        {
            employee.FirstName = request.FirstName;
            employee.LastName = request.LastName;
            employee.DateOfBirth = request.DateOfBirth;
            employee.Gender = request.Gender;
            employee.HireDate = request.HireDate;
            employee.CertificateNumber = request.CertificateNumber;

            if (employee.RoleId.Equals(RoleEnum.doctor.ToString(), StringComparison.CurrentCultureIgnoreCase) 
                && employee.Doctor != null)
            {
                employee.Doctor.Specialization = request.Specialization;
            }
        }
    }
}

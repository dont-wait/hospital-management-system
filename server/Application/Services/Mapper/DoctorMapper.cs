using Domain.Enums;

public class DoctorMapper : IDoctorMapper
{
    public ResponseDoctorDTO MapToDto(Doctor doctor, bool isHeadOfDepartment)
    {
        ResponseDoctorDTO dto = isHeadOfDepartment ? new ResponseHodDTO() : new ResponseDoctorDTO();

        dto.DoctorId = doctor.Employee.Doctor.Id;
        dto.EmployeeId = doctor.Employee.Id;
        dto.FirstName = doctor.Employee.FirstName;
        dto.LastName = doctor.Employee.LastName;
        dto.Email = doctor.Employee.Email;
        dto.PhoneNumber = doctor.Employee.PhoneNumber;
        dto.Specialization = doctor.Employee.Doctor.Specialization;
        dto.CertificateNumber = doctor.Employee.CertificateNumber;
        dto.DateOfBirth = doctor.Employee.DateOfBirth;
        dto.Gender = doctor.Employee.Gender;
        dto.HireDate = doctor.Employee.HireDate;
        dto.ExperienceYears = doctor.Employee.ExperienceYears;
        dto.DepartmentId = doctor.Employee.DepartmentId;
        dto.DepartmentName = doctor.Employee.Department.Name;
        dto.RoleId = isHeadOfDepartment ? RoleEnum.hod.ToString().ToLower() : RoleEnum.doctor.ToString().ToLower();
        
        if (isHeadOfDepartment && dto is ResponseHodDTO hodDto)
        {
            hodDto.FullName = $"{doctor.Employee.FirstName} {doctor.Employee.LastName}";
        }
        else
        {
            dto.FullName = $"{doctor.Employee.FirstName} {doctor.Employee.LastName}";
        }

        return dto;
    }

    public Doctor MapToEntity(RequestDoctorDTO doctorDto)
    {
        return new Doctor
        {
            Specialization = doctorDto.Specialization,

            Employee = new Employee
            {
                UserAccount = new UserAccount
                {
                    CitizenID = doctorDto.CitizenID,
                },
                FirstName = doctorDto.FirstName,
                LastName = doctorDto.LastName,
                Email = doctorDto.Email,
                PhoneNumber = doctorDto.PhoneNumber,
                CertificateNumber = doctorDto.CertificateNumber,
                DateOfBirth = doctorDto.DateOfBirth,
                Gender = doctorDto.Gender,
                HireDate = doctorDto.HireDate,
                RoleId = RoleEnum.doctor.ToString().ToLower()
            }
        };
    }

    public void Update(Doctor doctor, RequestUpdateEmployeeDTO doctorDto)
    {
        // Cập nhật các thuộc tính của Doctor
        doctor.Specialization = doctorDto.Specialization;

        if (doctor.Employee != null)
        {
            doctor.Employee.FirstName = doctorDto.FirstName;
            doctor.Employee.LastName = doctorDto.LastName;
            doctor.Employee.PhoneNumber = doctorDto.PhoneNumber;
            doctor.Employee.CertificateNumber = doctorDto.CertificateNumber;
            doctor.Employee.DateOfBirth = doctorDto.DateOfBirth;
            doctor.Employee.Gender = doctorDto.Gender;
            doctor.Employee.HireDate = doctorDto.HireDate;
            doctor.Employee.RoleId =RoleEnum.doctor.ToString().ToLower();
            doctor.Employee.UserAccount.AvatarUrl = doctorDto.AvatarUrl;
        }
    }
}

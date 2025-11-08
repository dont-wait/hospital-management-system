using Domain.Enums;

public class DoctorMapper : IDoctorMapper
{
    public ResponseDoctorDTO MapToDto(Doctor doctor)
    {
        return new ResponseDoctorDTO
        {
            DoctorId = doctor.Employee!.Doctor!.Id,
            EmployeeId = doctor.Employee!.Id,
            FirstName = doctor.Employee!.FirstName,
            LastName = doctor.Employee!.LastName,
            Email = doctor.Employee!.Email,
            PhoneNumber = doctor.Employee!.PhoneNumber,
            Specialization = doctor.Employee!.Doctor!.Specialization,
            CertificateNumber = doctor.Employee!.CertificateNumber,
            DateOfBirth = doctor.Employee!.DateOfBirth,
            Gender = doctor.Employee!.Gender,
            HireDate = doctor.Employee!.HireDate,
            RoleId = RoleEnum.doctor.ToString().ToLower(),
        };
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

    public void Update(Doctor doctor, RequestUpdateDoctorDTO doctorDto)
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
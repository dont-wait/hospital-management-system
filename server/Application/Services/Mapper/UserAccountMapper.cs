using Application.Common.DTOs.Patient;

public class UserAccountMapper : IUserAccountMapper
{
    public ResponseUserDTO MapToDto(UserAccount userAccount)
    {
    
        if (userAccount == null)
            return new ResponseUserDTO();

        var patient = userAccount.Patient;
        var employee = userAccount.Employee;

        return new ResponseUserDTO
        {
            UserAccountId = userAccount.Id,
            CitizenID = userAccount.CitizenID,
            AvatarUrl = userAccount?.AvatarUrl ?? string.Empty,
            Is_Active = userAccount?.Is_Active ?? 0,
            Patient = patient != null ? new ResponsePatientDTO
            {
                PatientId = patient.Id,
                CitizenID = patient.UserAccount!.CitizenID,
                AvatarUrl = patient.UserAccount!.AvatarUrl,
                FirstName = patient.FirstName,
                LastName = patient.LastName,
                PhoneNumber = patient.PhoneNumber,
                Email = patient.Email,
                DateOfBirth = patient.DateOfBirth,
                Gender = patient.Gender,
                Nationality = patient.Nationality,
                PlaceOfResidence = patient.PlaceOfResidence,
                Address = patient.Address,
                RoleId = patient.RoleId,
            } : null,
            Employee = employee != null ? new ResponseEmployeeDTO
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
                RoleId = employee.RoleId,
                ExperienceYears = employee.ExperienceYears,
                DepartmentName = employee.Department.Name
            } : null
        };
    }

    public UserAccount MapToEntity(RequestUserDTO userAccountDto)
    {
        throw new NotImplementedException();
    }

    public void Update(UserAccount userAccount, RequestUpdatePatient userAccountDto)
    {
        var patient = userAccount.Patient;
    
        if (patient == null)
            throw new ArgumentException("Thông tin của Bệnh nhân không tồn tại trong tài khoản người dùng này.");
        userAccount.AvatarUrl = userAccountDto.AvatarUrl;
        patient.FirstName = userAccountDto.FirstName;
        patient.LastName = userAccountDto.LastName;
        patient.PhoneNumber = userAccountDto.PhoneNumber;
        patient.Gender = userAccountDto.Gender;
        patient.DateOfBirth = userAccountDto.DateOfBirth;
        patient.Address = userAccountDto.Address;
        patient.Nationality = userAccountDto.Nationality;
        patient.PlaceOfResidence = userAccountDto.PlaceOfResidence;
    }
}
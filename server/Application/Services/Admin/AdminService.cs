using Application.Common.Utils;

namespace Application.Services.Admin;

public class AdminService : IAdminService
{
    private readonly IEmployeeRepository _employeeRepository;

    public AdminService(IEmployeeRepository employeeRepository)
    {
        _employeeRepository = employeeRepository;
    }

    public async Task<ServiceResult<List<ResponseDoctorDTO>>> GetAllDoctorsAsync()
    {
        List<UserAccount>? doctors = await _employeeRepository.GetAllDoctorAsync();

        if (doctors == null || doctors.Count == 0)
            return ServiceResult<List<ResponseDoctorDTO>>.Fail("Không tìm thấy bác sĩ nào");

        List<ResponseDoctorDTO> responseDoctors = doctors.Select(doctor => new ResponseDoctorDTO
        {
            DoctorId = doctor.Employee!.Doctor!.Id,
            FirstName = doctor.Employee!.FirstName,
            LastName = doctor.Employee!.LastName,
            Email = doctor.Employee!.Email,
            PhoneNumber = doctor.Employee!.PhoneNumber,
            Specialization = doctor.Employee!.Doctor!.Specialization,
            CertificateNumber = doctor.Employee!.CertificateNumber,
            DateOfBirth = doctor.Employee!.DateOfBirth,
            Gender = doctor.Employee!.Gender,
            HireDate = doctor.Employee!.HireDate,
            RoleId = doctor.Employee!.RoleId,
        }).ToList();

        return ServiceResult<List<ResponseDoctorDTO>>.Success(responseDoctors);
    }
}
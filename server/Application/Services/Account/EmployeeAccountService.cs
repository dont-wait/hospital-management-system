using Domain.Enums;
using Application.Common.Utils;

namespace Application.Services.Account;

public class EmployeeAccountService : IEmployeeAccountService
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUserAccountRepository _userAccountRepository;

    public EmployeeAccountService(IEmployeeRepository employeeRepository, IUserAccountRepository userAccountRepository)
    {
        _employeeRepository = employeeRepository;
        _userAccountRepository = userAccountRepository;
    }

    public async Task<ServiceResult<ResponseDoctorDTO>> CreateDoctorAsync(RequestDoctorDTO doctorDto)
    {
        if (await _userAccountRepository.GetUserAccountByCitizenIDAsync(doctorDto.CitizenID) != null)
            return ServiceResult<ResponseDoctorDTO>.Fail("Số CMND/CCCD đã tồn tại.");

        if (doctorDto.Password != doctorDto.ConfirmPassword)
            return ServiceResult<ResponseDoctorDTO>.Fail("Mật khẩu và xác nhận mật khẩu không khớp.");


        // TODO: VERIFY EMAIL AND PHONE THAT REAL
        if (!string.IsNullOrWhiteSpace(doctorDto.Email) && await _userAccountRepository
            .IsEmailExistsAsync(doctorDto.Email))
            return ServiceResult<ResponseDoctorDTO>.Fail("Email đã tồn tại.");

        if (!string.IsNullOrWhiteSpace(doctorDto.PhoneNumber) && await _userAccountRepository
            .IsPhoneNumberExistsAsync(doctorDto.PhoneNumber))
            return ServiceResult<ResponseDoctorDTO>.Fail("Số điện thoại đã tồn tại.");

        string hashedPassword = HashPasswordUtil.HashPassword(doctorDto.Password);
        doctorDto.Password = hashedPassword;

        Doctor newDoctor = await _employeeRepository.CreateDoctorAsync(doctorDto);
        if (newDoctor == null)
            return ServiceResult<ResponseDoctorDTO>.Fail("Tạo tài khoản thất bại.");

        var responseDoctorDto = new ResponseDoctorDTO
        {
            DoctorId = newDoctor.Id,
            EmployeeId = newDoctor.Employee.Id,
            FirstName = newDoctor.Employee.FirstName,
            LastName = newDoctor.Employee.LastName,
            PhoneNumber = newDoctor.Employee.PhoneNumber,
            Email = newDoctor.Employee.Email,
            Specialization = newDoctor.Specialization,
            CertificateNumber = newDoctor.Employee.CertificateNumber,
            DateOfBirth = newDoctor.Employee.DateOfBirth,
            Gender = newDoctor.Employee.Gender,
            HireDate = newDoctor.Employee.HireDate,
            RoleId = RoleEnum.doctor.ToString().ToLower()
        };

        return ServiceResult<ResponseDoctorDTO>.Success(responseDoctorDto);
    }

    public async Task<ServiceResult<ResponseUpdateDoctorDTO>> UpdateUserAccount_Doctor_Async(Guid doctorId, RequestUpdateDoctorDTO request)
    {
        Doctor? existingDoctor = await _employeeRepository.FindDoctorWithAccountByIdAsync(doctorId);
        if (existingDoctor == null)
            return ServiceResult<ResponseUpdateDoctorDTO>.Fail("Không tìm thấy thông tin người dùng");

        var existingEmployee = existingDoctor.Employee;
        var accountOfDoctor = existingDoctor.Employee.UserAccount;
        
        existingEmployee.FirstName = request.FirstName;
        existingEmployee.LastName = request.LastName;
        existingEmployee.PhoneNumber = request.PhoneNumber;
        existingEmployee.Gender = request.Gender;
        existingEmployee.DateOfBirth = request.DateOfBirth;
        existingEmployee.HireDate = request.HireDate;
        existingEmployee.CertificateNumber = request.CertificateNumber;
        existingDoctor.Specialization = request.Specialization;
        accountOfDoctor.AvatarUrl = request.AvatarUrl;

        await _employeeRepository.UpdateAccountAndDoctorAsync(existingDoctor, accountOfDoctor);

        ResponseUpdateDoctorDTO responseDoctorDto = new ResponseUpdateDoctorDTO
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.PhoneNumber,
            Gender = request.Gender,
            DateOfBirth = request.DateOfBirth,
            HireDate = request.HireDate,
            CertificateNumber = request.CertificateNumber,
            Specialization = request.Specialization,
            AvatarUrl = request.AvatarUrl
        };

        return ServiceResult<ResponseUpdateDoctorDTO>.Success(responseDoctorDto);
    }

    public async Task<ServiceResult<ResponseUserDTO?>> GetEmployeeByIdAsync(Guid employeeId)
    {
        var userAccount = await _employeeRepository.GetEmployeeByIdAsync(employeeId);
        if (userAccount == null)
            return ServiceResult<ResponseUserDTO?>.Fail("Nhân viên không tồn tại.");

        ResponseEmployeeDTO? employeeDto = null;

        if (userAccount.Employee != null)
        {
            var employee = userAccount.Employee;
            
            if (employee.RoleId == RoleEnum.doctor.ToString().ToLower())
            {
                employeeDto = new ResponseDoctorDTO
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
                    DoctorId = employee.Doctor?.Id ?? Guid.Empty,
                    Specialization = employee.Doctor?.Specialization ?? string.Empty
                };
            }
            else if (employee.RoleId == RoleEnum.admin.ToString().ToLower())
            {
                employeeDto = new ResponseAdminDto
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
            else
            {
                employeeDto = new ResponseEmployeeDTO
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

        ResponseUserDTO responseUserDto = new ResponseUserDTO
        {
            UserAccountId = userAccount.Id,
            AvatarUrl = userAccount.AvatarUrl,
            Is_Active = userAccount.Is_Active,
            CitizenID = userAccount.CitizenID,
            Employee = employeeDto
        };

        return ServiceResult<ResponseUserDTO?>.Success(responseUserDto);
    }

    public async Task<ServiceResult<List<ResponseDoctorDTO>>> GetAllDoctorsAsync()
    {
        List<UserAccount>? doctors = await _employeeRepository.GetAllDoctorAsync();

        if (doctors == null || doctors.Count == 0)
            return ServiceResult<List<ResponseDoctorDTO>>.Fail("Không tìm thấy bác sĩ nào");

        List<ResponseDoctorDTO> responseDoctors = doctors.Select(doctor => new ResponseDoctorDTO
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
            RoleId = doctor.Employee!.RoleId,
        }).ToList();

        return ServiceResult<List<ResponseDoctorDTO>>.Success(responseDoctors);
    }
}
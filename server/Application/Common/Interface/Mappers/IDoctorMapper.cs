public interface IDoctorMapper
{
    ResponseDoctorDTO MapToDto(Doctor doctor, bool isHeadOfDepartment);
    Doctor MapToEntity(RequestDoctorDTO doctorDto);

    void Update(Doctor doctor, RequestUpdateEmployeeDTO doctorDto);
}
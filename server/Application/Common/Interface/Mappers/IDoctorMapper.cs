public interface IDoctorMapper
{
    ResponseDoctorDTO MapToDto(Doctor doctor);
    Doctor MapToEntity(RequestDoctorDTO doctorDto);

    void Update(Doctor doctor, RequestUpdateDoctorDTO doctorDto);
}
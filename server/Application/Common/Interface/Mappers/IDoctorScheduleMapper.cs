using Application.Common.DTOs.Schedule;

namespace Application.Common.Interface.Mappers;
public interface IDoctorScheduleMapper
{
    ResponseDoctorScheduleDTO ToDTO(DoctorSchedule doctorSchedule);
}
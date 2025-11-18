using Application.Common.DTOs.Schedule;
using Application.Common.DTOs.SlotTime;
using Application.Common.Interface.Mappers;

namespace Application.Services.Mapper;
public class DoctorScheduleMapper : IDoctorScheduleMapper
{
    public ResponseDoctorScheduleDTO ToDTO(DoctorSchedule doctorSchedule)
    {
        if (doctorSchedule.Doctor != null)
            return new ResponseDoctorScheduleDTO()
            {
                ScheduleId = doctorSchedule.ScheduleId,
                StartTime = doctorSchedule.StartTime,
                EndTime = doctorSchedule.EndTime,
                ScheduleStatus = doctorSchedule.EmployeeSchedule.ScheduleStatus,
                RoomName = doctorSchedule.EmployeeSchedule.Room.Name,
                Doctor = new ResponseDoctorDTO()
                {
                    DoctorId = doctorSchedule.Doctor.Id,
                    FullName = doctorSchedule.Doctor.Employee.FirstName + " " + doctorSchedule.Doctor.Employee.LastName,
                    Email = doctorSchedule.Doctor.Employee.Email,
                    PhoneNumber = doctorSchedule.Doctor.Employee.PhoneNumber,
                    Specialization = doctorSchedule.Doctor.Specialization,
                },
                SlotTimes = doctorSchedule.SlotTimes.Select(slot => new ResponseSlotTimeDTO()
                {
                    SlotId = slot.Id,
                    SlotStartTime = slot.SlotStartTime,
                    SlotEndTime = slot.SlotEndTime,
                    SlotStatus = slot.SlotStatus
                }).ToList()
            };
        return new ResponseDoctorScheduleDTO();
    }
}
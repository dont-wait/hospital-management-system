using Application.Common.Utils;
public interface ITaskItemService
{
    Task<ServiceResult<ResponseAvailableAppointment>> GetAvailableAppointments(DateOnly? date, int? departmentId, Guid? doctorId);
    Task<ServiceResult<ResponseTaskItemDTO>> CreateTaskItemAsync(
        RequestTaskItemDTO requestTaskItemDTO, 
        List<RequestTaskRegistrationDTO> taskRegistrations
    );
}
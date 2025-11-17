using Application.Common.Interface.Appointment;
using Application.Common.Utils;

namespace Application.Services.Appointement;
public class AppointmentService : IAppointmentService
{

    private readonly IAppointmentRepository _appointmentRepository;
    private readonly IUserAccountRepository _userAccountRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IAppointmentMapper _appointmentMapper;

    public AppointmentService(IAppointmentRepository appointmentRepository,
                            IAppointmentMapper appointmentMapper,
                            IUserAccountRepository userAccountRepository,
                            IEmployeeRepository employeeRepository)
    {
        _appointmentRepository = appointmentRepository;
        _appointmentMapper = appointmentMapper;
        _userAccountRepository = userAccountRepository;
        _employeeRepository = employeeRepository;
    }

    public Task<ServiceResult<ResponseAppointmentDTO>> CreateAppointmentAsync(RequestAppointmentDTO appointmentDto)
    {
        throw new NotImplementedException();        
    }

    public Task<ServiceResult<string>> DeleteAppointmentAsync(Guid appointmentId)
    {
        throw new NotImplementedException();
    }

    public Task<ServiceResult<ResponseAppointmentDTO?>> GetAppointmentByIdAsync(Guid appointmentId)
    {
        throw new NotImplementedException();
    }

    public Task<ServiceResult<ResponseAppointmentDTO>> UpdateAppointmentAsync(Guid appointmentId, RequestUpdateAppointmentDTO appointmentDto)
    {
        throw new NotImplementedException();
    }
}
using Application.Common.Utils;
using Domain.Enums;
public class AppointmentService : IAppointmentService
{

    private readonly IUserAccountRepository _userAccountRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IDepartmentRepository _departmentRepository;
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly ISlotTimeRepository _slotTimeRepository;
    private readonly ITaskItemRepository _taskItemRepository;
    private readonly IBillingRepository _billingRepository;
    public AppointmentService(
                            IUserAccountRepository userAccountRepository,
                            IEmployeeRepository employeeRepository,
                            IDepartmentRepository departmentRepository,
                            ITaskItemRepository taskItemRepository,
                            IBillingRepository billingRepository,
                            IAppointmentRepository appointmentRepository,
                            ISlotTimeRepository slotTimeRepository
                            )
    {
        _userAccountRepository = userAccountRepository;
        _employeeRepository = employeeRepository;
        _departmentRepository = departmentRepository;
        _taskItemRepository = taskItemRepository;
        _billingRepository = billingRepository;
        _appointmentRepository = appointmentRepository;
        _slotTimeRepository = slotTimeRepository;
        
    }
    
    
    
    public async Task<ServiceResult<string>> CreateAppointment(RequestAppointmentDTO request)
{
    Patient? existingPatient = await _userAccountRepository.FindPatientWithAccountByIdAsync(request.PatientId);
    if(existingPatient == null)
        return ServiceResult<string>.Fail("Mã Bệnh nhân không tồn tại");

    int successCount = 0;
    var errors = new List<string>();

    foreach(var slot in request.AppointmentSlots)
    {
        UserAccount? existingDoctorWithAccount = await _employeeRepository.GetDoctorByDoctorIdAsync(slot.DoctorId);
        if(existingDoctorWithAccount == null)
        {
            errors.Add($"Mã bác sĩ {slot.DoctorId} không tồn tại");
            continue;
        }

        Department? existingDepartment = await _departmentRepository.GetDepartmentByIdAsync(slot.DepartmentId);
        if(existingDepartment == null)
        {
            errors.Add($"Mã chuyên khoa {slot.DepartmentId} không tồn tại");
            continue;
        }

        var taskInfoAppointment = await _taskItemRepository.GetTaskItemBySlotTimeIdAsync(slot.SlotTimeId);
        if(taskInfoAppointment == null)
        {
            errors.Add($"Không tìm thấy thông tin lịch hẹn cho khung giờ {slot.SlotTimeId}");
            continue;
        }

        var slotTime = taskInfoAppointment.TaskRegistrations
            .SelectMany(tr => tr.SlotTimes)
            .FirstOrDefault(st => st.Id == slot.SlotTimeId);

        if(slotTime == null)
        {
            errors.Add($"Không tìm thấy thông tin khung giờ hẹn {slot.SlotTimeId}");
            continue;
        }

        if(await _appointmentRepository.IsExistingAppointmentAsync(slot.AppointmentDate, slotTime.SlotStartTime, slotTime.SlotEndTime))
        {
            errors.Add($"Trùng ngày hẹn {slot.AppointmentDate} với lịch đã đặt trước đó");
            continue;
        }

        var availableSlot = await _slotTimeRepository.IsAvailableSlotTimeForBookAsync(slot.SlotTimeId);
        if(availableSlot == false)
        {
            errors.Add($"Khung giờ {slot.SlotTimeId} không khả dụng để đặt lịch hẹn");
            continue;
        }

        Billing newBilling = new Billing()
        {
            BillingStatus = BillingStatusEnum.UnPaid.ToString(),
            DiscountAmount = existingPatient.Is_Insurance == 1 ? 0.8 : 0,
            PaymentMethod = PaymentMethodEnum.EWallet.ToString(),
            PaymentAmount = 200000,
        };

        await _billingRepository.CreateBillingAsync(newBilling);

        Appointment newAppointment = new Appointment
        {
            PatientId = request.PatientId,
            DoctorId = slot.DoctorId,
            RoomId = taskInfoAppointment.RoomId,
            AppointmentDate = slot.AppointmentDate,
            AppointmentStartTime = slotTime.SlotStartTime,
            AppointmentEndTime = slotTime.SlotEndTime,
            AppointmentStatus = AppointmentStatusEnum.Unpaid.ToString(),
            SlotTimeId = slot.SlotTimeId,
            ServiceId = 5,
            BillingId = newBilling.Id
        };

        slotTime.CurrentAppointments += 1;
        if(slotTime.CurrentAppointments >= slotTime.MaxAppointments)
            slotTime.SlotStatus = SlotStatusEnum.Full.ToString();

        _slotTimeRepository.UpdateAsync(slotTime);
        await _appointmentRepository.CreateAppointmentAsync(newAppointment);
        successCount++;
    }

    if(successCount == 0)
        return ServiceResult<string>.Fail(string.Join("; ", errors));

    string message = successCount == request.AppointmentSlots.Count
        ? "Bạn đã đăng ký thành công"
        : $"Đã đăng ký thành công {successCount}/{request.AppointmentSlots.Count} cuộc hẹn. Lỗi: {string.Join("; ", errors)}";

    return ServiceResult<string>.Success(message);
}
    public async Task<ServiceResult<List<ResponseAppointmentDTO>>> GetAppointments(string? status, Guid? patientId, int page, int size)
    {
        if (patientId != null)
        {
            Patient existingPatient = await _userAccountRepository.FindPatientWithAccountByIdAsync(patientId.Value);
            if (existingPatient == null)
                return ServiceResult<List<ResponseAppointmentDTO>>.Fail("Bệnh nhân không tồn tại");
        }
        
        List<Appointment> appointments = await _appointmentRepository.GetAllAppointmentsAsync(status, patientId, page, size);
        
        List<ResponseAppointmentDTO > appointmentDtos = new List<ResponseAppointmentDTO>();
        foreach (var appointment in appointments)
        {
            appointmentDtos.Add(new ResponseAppointmentDTO
                {
                    AppointmentId = appointment.Id,
                    BillingId = appointment.Billing.Id,
                    DepartmentName = appointment.Room.Department.Name,
                    RoomName = appointment.Room.Name,
                    FullName = $"{appointment.Patient!.FirstName} {appointment.Patient.LastName}",
                    DateOfBirth = appointment.Patient.DateOfBirth,
                    Gender = appointment.Patient.Gender,
                    AppointmentStatus = appointment.AppointmentStatus,
                    AppointmentDate = appointment.AppointmentDate,
                    AppointmentStartTime = appointment.AppointmentStartTime,
                    AppointmentEndTime = appointment.AppointmentEndTime,
                    PriceOfService = appointment.Billing.PaymentAmount,
                    DoctorName = appointment.Doctor != null
                        ? $"{appointment.Doctor.Employee.FirstName} {appointment.Doctor.Employee.LastName}"
                    : string.Empty
                }
            );
        }
        
        return ServiceResult<List<ResponseAppointmentDTO>>.Success(appointmentDtos);
    }
    public Task<ServiceResult<string>> UpdateAppointment(RequestAppointmentDTO updateAppointmentDto)
    {
        throw new NotImplementedException();
    }
    public async Task<ServiceResult<bool>> DeleteAppointment(long appointmentId)
    {
        Appointment? existingAppointment = await _appointmentRepository.GetAppointmentByIdAsync(appointmentId);
        if(existingAppointment == null)
            return ServiceResult<bool>.Fail("Đăng ký khám không tồn tại");
        bool isDeleted = await _appointmentRepository.DeleteAppointmentAsync(appointmentId);
        if(!isDeleted)
            return ServiceResult<bool>.Fail("Xóa đăng ký khám thất bại");
        return ServiceResult<bool>.Success(true);
    }
    public async Task<ServiceResult<ResponseAppointmentDTO>> GetAppointmentByIdAsync(long appointmentId)
    {
        Appointment? existingAppointment = await _appointmentRepository.GetAppointmentByIdAsync(appointmentId);
        if(existingAppointment == null)
            return ServiceResult<ResponseAppointmentDTO>.Fail("Đăng ký khám không tồn tại");
        ResponseAppointmentDTO appointmentDto = new ResponseAppointmentDTO
        {
            AppointmentId = existingAppointment.Id,
            BillingId = existingAppointment.Billing.Id,
            DepartmentName = existingAppointment.Room.Department.Name,
            RoomName = existingAppointment.Room.Name,
            FullName = $"{existingAppointment.Patient!.FirstName} {existingAppointment.Patient.LastName}",
            DateOfBirth = existingAppointment.Patient.DateOfBirth,
            Gender = existingAppointment.Patient.Gender,
            AppointmentStatus = existingAppointment.AppointmentStatus,
            AppointmentDate = existingAppointment.AppointmentDate,
            AppointmentStartTime = existingAppointment.AppointmentStartTime,
            AppointmentEndTime = existingAppointment.AppointmentEndTime,
            PriceOfService = existingAppointment.Billing.PaymentAmount,
            DoctorName = existingAppointment.Doctor != null
                ? $"{existingAppointment.Doctor.Employee.FirstName} {existingAppointment.Doctor.Employee.LastName}"
                : string.Empty
        };
        return ServiceResult<ResponseAppointmentDTO>.Success(appointmentDto);
    }

}
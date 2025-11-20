using Application.Common.Utils;
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
    
    public async Task<ServiceResult<ResponseAppointmentDTO>> CreateAppointment(RequestAppointmentDTO request)
    {
        Patient? existingPatient = await _userAccountRepository.FindPatientWithAccountByIdAsync(request.PatientId);
        if(existingPatient == null)
            return ServiceResult<ResponseAppointmentDTO>.Fail("Mã Bệnh nhân không tồn tại");
        
        UserAccount? existingDoctorWithAccount = await _employeeRepository.GetDoctorByDoctorIdAsync(request.DoctorId);
        if(existingDoctorWithAccount == null)
            return ServiceResult<ResponseAppointmentDTO>.Fail("Mã bác sĩ không tồn tại");
        
        Department? existingDepartment = await _departmentRepository.GetDepartmentByIdAsync(request.DepartmentId);
        if(existingDepartment == null)
            return ServiceResult<ResponseAppointmentDTO>.Fail("Mã chuyên khoa không tồn tại");
        
        var taskInfoAppointment = await _taskItemRepository.GetTaskItemBySlotTimeIdAsync(request.SlotTimeId);
        if(taskInfoAppointment == null)
            return ServiceResult<ResponseAppointmentDTO>.Fail("Không tìm thấy thông tin lịch hẹn");

        var slotTime = taskInfoAppointment.SlotTimes
            .FirstOrDefault(st => st.Id == request.SlotTimeId);
        
        if(slotTime == null)
            return ServiceResult<ResponseAppointmentDTO>.Fail("Không tìm thấy thông tin khung giờ hẹn");
        
        if(await _appointmentRepository.IsExistingAppointmentAsync(request.AppointmentDate, slotTime.SlotStartTime, slotTime.SlotEndTime))
            return ServiceResult<ResponseAppointmentDTO>.Fail("Trùng ngày hẹn với lịch đã đặt trước đó");
        
        var availableSlot = await _slotTimeRepository.IsAvailableSlotTimeForBookAsync(request.SlotTimeId);
        if(availableSlot == false)
            return ServiceResult<ResponseAppointmentDTO>.Fail("Khung giờ không khả dụng để đặt lịch hẹn"); //full rui
        
        
        

        Billing newBilling = new Billing()
        {
            BillingStatus = BillingStatusEnum.UnPaid.ToString(),
            DiscountAmount = existingPatient.Is_Insurance == 1 ? 0.8 : 0, //Giam 80% neu co BHYT
            PaymentMethod = PaymentMethodEnum.EWallet.ToString(),
            PaymentAmount = 200000 , //Gia mac dinh
        };
        
        await _billingRepository.CreateBillingAsync(newBilling);
        
        

        Appointment newAppointment = new Appointment
        {
            PatientId = request.PatientId,
            DoctorId = request.DoctorId,
            RoomId = taskInfoAppointment.RoomId,
            AppointmentDate = request.AppointmentDate,
            AppointmentStartTime = slotTime.SlotStartTime,
            AppointmentEndTime = slotTime.SlotEndTime,
            AppointmentStatus = AppointmentStatusEnum.Pending.ToString(),
            ServiceId = 5, //Dang ky kham mac dinh la 5
            BillingId = newBilling.Id
        };

        slotTime.CurrentAppointments += 1;
        _slotTimeRepository.UpdateAsync(slotTime);
        
        await _appointmentRepository.CreateAppointmentAsync(newAppointment);
        
        // Lấy thông tin Doctor
        var doctorRegistration = taskInfoAppointment.TaskRegistrations
            .FirstOrDefault(tr => tr.Employee.Doctor.Id == request.DoctorId);
        
        var response = new ResponseAppointmentDTO
        {
            AppointmentId = newAppointment.Id,
            BillingId = newBilling.Id,
            DepartmentName = existingDepartment.Name,
            RoomName = taskInfoAppointment.Room?.Name ?? string.Empty,
            FullName = $"{existingPatient.FirstName} {existingPatient.LastName}",
            DateOfBirth = existingPatient.DateOfBirth,
            Gender = existingPatient.Gender,
            AppointmentDate = request.AppointmentDate,
            AppointmentStartTime = slotTime.SlotStartTime,
            AppointmentEndTime = slotTime.SlotEndTime,
            PriceOfService = 200000,
            DoctorName = existingDoctorWithAccount.Employee != null
                ? $"{existingDoctorWithAccount.Employee.FirstName} {existingDoctorWithAccount.Employee.LastName}"
                : string.Empty
        };

        return ServiceResult<ResponseAppointmentDTO>.Success(response);
    }
}
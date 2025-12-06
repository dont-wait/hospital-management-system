using Application.Common.Utils;
public class MedicalVisitService : IMedicalVisitService
{
    private readonly IMedicalVisitRepository _medicalVisitRepository;
    private readonly IAppointmentRepository _appointmentRepository;
    
    public MedicalVisitService(IMedicalVisitRepository medicalVisitRepository, IAppointmentRepository appointmentRepository)
    {
        _medicalVisitRepository = medicalVisitRepository;
        _appointmentRepository = appointmentRepository;
    }
    
    public async Task<ServiceResult<ResponseMedicalVisitDTO>> CreateMedicalVisitAsync(RequestMedicalVisitDTO request)
    {
        Appointment? appointment = await _appointmentRepository.GetAppointmentByIdAsync(request.AppointmentId);
        if (appointment == null)
        {
            return ServiceResult<ResponseMedicalVisitDTO>.Fail("Không tìm thấy thông tin cuộc hẹn");
        }
        
        MedicalVisit medicalVisit = new MedicalVisit
        {
            Symptoms = request.Symptoms,
            PhysicalExamination = request.PhysicalExamination,
            Diagnosis = request.Diagnosis,
            Treatment = request.Treatment,
            Note = request.Note,
            ImageResult = request.ImageResult,
            Appointment = appointment
        };
        
        MedicalVisit createdMedicalVisit = await _medicalVisitRepository.CreateMedicalVisitAsync(medicalVisit);
        
        ResponseMedicalVisitDTO response = new ResponseMedicalVisitDTO
        {
            Id = createdMedicalVisit.Id,
            Symptoms = createdMedicalVisit.Symptoms,
            PhysicalExamination = createdMedicalVisit.PhysicalExamination,
            Diagnosis = createdMedicalVisit.Diagnosis,
            Treatment = createdMedicalVisit.Treatment,
            Note = createdMedicalVisit.Note,
            ImageResult = createdMedicalVisit.ImageResult,
            AppointmentId = createdMedicalVisit.Appointment!.Id
        };
        
        return ServiceResult<ResponseMedicalVisitDTO>.Success(response);
    }
    public async Task<ServiceResult<ResponseMedicalVisitDTO?>> GetMedicalVisitByIdAsync(long medicalVisitId)
    {
        var response = await _medicalVisitRepository.GetMedicalVisitByIdAsync(medicalVisitId);
        if (response == null)
        {
            return ServiceResult<ResponseMedicalVisitDTO?>.Fail("Không tìm thấy thông tin chuẩn đoán");
        }
        ResponseMedicalVisitDTO dto = new ResponseMedicalVisitDTO
        {
            Id = response.Id,
            Symptoms = response.Symptoms,
            PhysicalExamination = response.PhysicalExamination,
            Diagnosis = response.Diagnosis,
            Treatment = response.Treatment,
            Note = response.Note,
            ImageResult = response.ImageResult,
            AppointmentId = response.Appointment!.Id
        };
        return ServiceResult<ResponseMedicalVisitDTO?>.Success(dto);
    }
    public async Task<ServiceResult<List<ResponseMedicalVisitDTO>>> GetMedicalVisitsByPatientIdAsync(Guid patientId)
    {
        
        var response = await _medicalVisitRepository.GetMedicalVisitsByPatientIdAsync(patientId);
        if (response == null)
        {
            return ServiceResult<List<ResponseMedicalVisitDTO>>.Fail("Không tìm thấy thông tin chuẩn đoán");
        }
        List<ResponseMedicalVisitDTO> dto = response.Select(mv => new ResponseMedicalVisitDTO
        {
            Id = mv.Id,
            Symptoms = mv.Symptoms,
            PhysicalExamination = mv.PhysicalExamination,
            Diagnosis = mv.Diagnosis,
            Treatment = mv.Treatment,
            Note = mv.Note,
            ImageResult = mv.ImageResult,
            AppointmentId = mv.Appointment!.Id
        }).ToList();
        return ServiceResult<List<ResponseMedicalVisitDTO>>.Success(dto);
    }
}
using Application.Common.Utils;

public class PrescriptionSerivce : IPrescriptionService
{
    private readonly IPrescriptionRepository _prescriptionRepository;
    private readonly IMedicalVisitRepository _medicalVisitRepository;
    
    public PrescriptionSerivce(
        IPrescriptionRepository prescriptionRepository,
        IMedicalVisitRepository medicalVisitRepository)
    {
        _prescriptionRepository = prescriptionRepository;
        _medicalVisitRepository = medicalVisitRepository;
    }

    public async Task<ServiceResult<ResponsePrescriptionDTO>> CreatePrescriptionAsync(RequestPrescriptionDTO request)
    {
        // Validate MedicalVisit exists
        var medicalVisit = await _medicalVisitRepository.GetMedicalVisitByIdAsync(request.MedicalVisitId);
        if (medicalVisit == null)
            return ServiceResult<ResponsePrescriptionDTO>.Fail("Không tìm thấy thông tin lần khám");

        // Validate prescription details
        if (!request.PrescriptionDetails.Any())
            return ServiceResult<ResponsePrescriptionDTO>.Fail("Chi tiết đơn thuốc không được để trống");

        // Create prescription entity
        var prescription = new Prescription
        {
            Instructions = request.Instructions,
            Note = request.Note,
            MedicalVisit = medicalVisit,
            PrescriptionDetails = request.PrescriptionDetails.Select(d => new PrescriptionDetail
            {
                Dosage = d.Dosage,
                MedicationName = d.MedicationName,
                Frequency = d.Frequency,
                Duration = d.Duration,
                Route = d.Route,
                Quantity = d.Quantity
            }).ToList()
        };

        // Save to database
        var createdPrescription = await _prescriptionRepository.CreatePrescriptionAsync(prescription);

        // Map to response DTO
        var response = new ResponsePrescriptionDTO
        {
            Id = createdPrescription.Id,
            Instructions = createdPrescription.Instructions,
            Note = createdPrescription.Note,
            MedicareVisitId = createdPrescription.MedicalVisit.Id,
            PrescriptionDetails = createdPrescription.PrescriptionDetails.Select(d => new ResponsePrescriptionDetailDTO
            {
                Id = d.Id,
                PrescriptionId = d.PrescriptionId,
                MedicationName = d.MedicationName,
                Dosage = d.Dosage,
                Frequency = d.Frequency,
                Duration = d.Duration,
                Route = d.Route,
                Quantity = d.Quantity
            }).ToList()
        };

        return ServiceResult<ResponsePrescriptionDTO>.Success(response);
    }

    public async Task<ServiceResult<ResponsePrescriptionDTO?>> GetPrescriptionByIdAsync(long prescriptionId)
    {
        var prescription = await _prescriptionRepository.GetPrescriptionByIdAsync(prescriptionId);
        
        if (prescription == null)
            return ServiceResult<ResponsePrescriptionDTO?>.Fail("Không tìm thấy đơn thuốc");

        var response = new ResponsePrescriptionDTO
        {
            Id = prescription.Id,
            Instructions = prescription.Instructions,
            Note = prescription.Note,
            MedicareVisitId = prescription.MedicalVisit.Id,
            PrescriptionDetails = prescription.PrescriptionDetails.Select(d => new ResponsePrescriptionDetailDTO
            {
                Id = d.Id,
                PrescriptionId = d.PrescriptionId,
                MedicationName = d.MedicationName,
                Dosage = d.Dosage,
                Frequency = d.Frequency,
                Duration = d.Duration,
                Route = d.Route,
                Quantity = d.Quantity
            }).ToList()
        };

        return ServiceResult<ResponsePrescriptionDTO?>.Success(response);
    }

    public async Task<ServiceResult<List<ResponsePrescriptionDTO>>> GetPrescriptionsByMedicalVisitIdAsync(long medicalVisitId)
    {
        // Validate medical visit exists
        var medicalVisit = await _medicalVisitRepository.GetMedicalVisitByIdAsync(medicalVisitId);
        if (medicalVisit == null)
            return ServiceResult<List<ResponsePrescriptionDTO>>.Fail("Không tìm thấy thông tin lần khám");

        var prescriptions = await _prescriptionRepository.GetPrescriptionsByMedicalVisitIdAsync(medicalVisitId);

        var response = prescriptions.Select(prescription => new ResponsePrescriptionDTO
        {
            Id = prescription.Id,
            Instructions = prescription.Instructions,
            Note = prescription.Note,
            MedicareVisitId = prescription.MedicalVisit.Id,
            PrescriptionDetails = prescription.PrescriptionDetails.Select(d => new ResponsePrescriptionDetailDTO
            {
                Id = d.Id,
                PrescriptionId = d.PrescriptionId,
                MedicationName = d.MedicationName,
                Dosage = d.Dosage,
                Frequency = d.Frequency,
                Duration = d.Duration,
                Route = d.Route,
                Quantity = d.Quantity
            }).ToList()
        }).ToList();

        return ServiceResult<List<ResponsePrescriptionDTO>>.Success(response);
    }

    public async Task<ServiceResult<List<ResponsePrescriptionDTO>>> GetPrescriptionsByPatientIdAsync(Guid patientId)
    {
        var prescriptions = await _prescriptionRepository.GetPrescriptionsByPatientIdAsync(patientId);

        if (!prescriptions.Any())
            return ServiceResult<List<ResponsePrescriptionDTO>>.Fail("Không tìm thấy đơn thuốc cho bệnh nhân này");

        var response = prescriptions.Select(prescription => new ResponsePrescriptionDTO
        {
            Id = prescription.Id,
            Instructions = prescription.Instructions,
            Note = prescription.Note,
            MedicareVisitId = prescription.MedicalVisit.Id,

            PrescriptionDetails = prescription.PrescriptionDetails.Select(d => new ResponsePrescriptionDetailDTO
            {
                Id = d.Id,
                PrescriptionId = d.PrescriptionId,
                MedicationName = d.MedicationName,
                Dosage = d.Dosage,
                Frequency = d.Frequency,
                Duration = d.Duration,
                Route = d.Route,
                Quantity = d.Quantity
            }).ToList()
        }).ToList();

        return ServiceResult<List<ResponsePrescriptionDTO>>.Success(response);
    }
}
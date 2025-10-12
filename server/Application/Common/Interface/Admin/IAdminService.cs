using Application.Common.Utils;

public interface IAdminService
{
    Task<ServiceResult<List<ResponseDoctorDTO>>> GetAllDoctorsAsync();
}
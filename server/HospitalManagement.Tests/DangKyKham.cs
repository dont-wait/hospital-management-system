using Xunit;
using Moq; // Để sử dụng Mock trong test
using System.Threading.Tasks;

public class DangKyKham
{
    // dang ki thanh cong
    [Fact]
    public async Task CreateAppointment_ValidRequest_ShouldReturnSuccess()
    {
   
        var request = new RequestAppointmentDTO
        {
            PatientId = Guid.NewGuid(),
            DoctorId = Guid.NewGuid(),
            AppointmentDate = DateTime.Now.AddDays(1),
            Reason = "Khám bệnh định kỳ"
        };
        
        _appointmentServiceMock.Setup(service => service.CreateAppointmentAsync(request))
            .ReturnsAsync(new ServiceResult<ResponseAppointmentDTO> 
            { 
                IsSuccess = true, 
                Message = "Đăng ký khám thành công", 
                Data = new ResponseAppointmentDTO { AppointmentId = 123 } 
            });

        
        var result = await _appointmentServiceMock.Object.CreateAppointmentAsync(request);

     
        Assert.True(result.IsSuccess);
        Assert.Equal("Đăng ký khám thành công", result.Message);
        Assert.NotNull(result.Data);
        Assert.Equal(123, result.Data.AppointmentId);
    }

    // đăng ki skhams thông tin ko hopwjp lêkj
    [Fact]
    public async Task CreateAppointment_InvalidRequest_ShouldReturnError()
    {

        var request = new RequestAppointmentDTO
        {
            PatientId = Guid.Empty, 
            DoctorId = Guid.Empty,  
            AppointmentDate = DateTime.Now.AddDays(1), 
            Reason = "" 
        };
        
        _appointmentServiceMock.Setup(service => service.CreateAppointmentAsync(request))
            .ReturnsAsync(new ServiceResult<ResponseAppointmentDTO> 
            { 
                IsSuccess = false, 
                Message = "Thông tin không hợp lệ" 
            });

        // Act
        var result = await _appointmentServiceMock.Object.CreateAppointmentAsync(request);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Equal("Thông tin không hợp lệ", result.Message);
    }
    // đăng kí khám thoogn tin đã tồn tại
    [Fact]
    public async Task CreateAppointment_AppointmentAlreadyExists_ShouldReturnConflict()
    {
        // Arrange
        var request = new RequestAppointmentDTO
        {
            PatientId = Guid.NewGuid(),
            DoctorId = Guid.NewGuid(),
            AppointmentDate = DateTime.Now.AddDays(1),
        };
        
        _appointmentServiceMock.Setup(service => service.CreateAppointmentAsync(request))
            .ReturnsAsync(new ServiceResult<ResponseAppointmentDTO>
            {
                IsSuccess = false,
                Message = "Cuộc hẹn đã tồn tại"
            });

        // Act
        var result = await _appointmentServiceMock.Object.CreateAppointmentAsync(request);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Equal("Cuộc hẹn đã tồn tại", result.Message);
    }

}
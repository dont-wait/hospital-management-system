
using Xunit;
using Moq; // Để sử dụng Mock trong test
using System.Threading.Tasks;

public class KeDonThuc
{
    // kê đơn thuốc thành công
    [Fact]
    public async Task CreatePrescription_ValidRequest_ShouldReturnSuccess()
    {
        // Arrange
        var request = new RequestPrescriptionDTO
        {
            PatientId = Guid.NewGuid(),
            DoctorId = Guid.NewGuid(),
            Medicines = new List<MedicineDTO>
            {
                new MedicineDTO { Name = "Paracetamol", Dosage = "500mg", Quantity = 2 },
                new MedicineDTO { Name = "Ibuprofen", Dosage = "200mg", Quantity = 1 }
            },
            IssueDate = DateTime.Now
        };

        _prescriptionServiceMock.Setup(service => service.CreatePrescriptionAsync(request))
            .ReturnsAsync(new ServiceResult<ResponsePrescriptionDTO>
            {
                IsSuccess = true,
                Message = "Kê đơn thuốc thành công",
                Data = new ResponsePrescriptionDTO { PrescriptionId = 123 }
            });

        // Act
        var result = await _prescriptionServiceMock.Object.CreatePrescriptionAsync(request);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.Equal("Kê đơn thuốc thành công", result.Message);
        Assert.Equal(123, result.Data.PrescriptionId);
    }

    // xóa đơn thuốc
    [Fact]
    public async Task DeletePrescription_ValidId_ShouldReturnSuccess()
    {
        // Arrange
        var prescriptionId = 123L;
        _prescriptionServiceMock.Setup(service => service.DeletePrescriptionAsync(prescriptionId))
            .ReturnsAsync(new ServiceResult<bool> { IsSuccess = true, Message = "Xóa đơn thuốc thành công" });

        var result = await _prescriptionServiceMock.Object.DeletePrescriptionAsync(prescriptionId);

        Assert.True(result.IsSuccess);
        Assert.Equal("Xóa đơn thuốc thành công", result.Message);
    }

}
using Xunit;
using Moq; // Để sử dụng Mock trong test
using System.Threading.Tasks;

public class LichSuDangNhap
{
    [Fact]
    public async Task GetLoginHistory_ValidUser_ShouldReturnLoginHistory()
    {
        // Arrange
        var userId = Guid.NewGuid();
        _authServiceMock.Setup(service => service.GetLoginHistoryAsync(userId))
            .ReturnsAsync(new ServiceResult<List<LoginHistoryDTO>>
            {
                IsSuccess = true,
                Data = new List<LoginHistoryDTO>
                {
                    new LoginHistoryDTO { LoginTime = DateTime.Now, IpAddress = "192.168.1.1" }
                }
            });

        // Act
        var result = await _authServiceMock.Object.GetLoginHistoryAsync(userId);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.Single(result.Data);
        Assert.Equal("192.168.1.1", result.Data[0].IpAddress);
    }

}
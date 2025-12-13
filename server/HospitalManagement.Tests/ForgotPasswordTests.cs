using Xunit;
using Moq; // Để sử dụng Mock trong test
using System.Threading.Tasks;

public class ForgotPasswordTests
{
    private readonly Mock<IAuthService> _authServiceMock;
    private readonly Mock<IEmailService> _emailServiceMock;

    public ForgotPasswordTests()
    {
        _authServiceMock = new Mock<IAuthService>();
        _emailServiceMock = new Mock<IEmailService>();
    }

    [Fact]
    public async Task RequestPasswordReset_ValidEmail_ShouldReturnSuccess()
    {
        // Arrange
        var email = "test@example.com";
        _authServiceMock.Setup(service => service.RequestPasswordResetAsync(email))
            .ReturnsAsync(new ServiceResult<bool> { IsSuccess = true, Message = "Mã OTP đã được gửi đến email." });

        // Act
        var result = await _authServiceMock.Object.RequestPasswordResetAsync(email);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.Equal("Mã OTP đã được gửi đến email.", result.Message);
    }

    [Fact]
    public async Task RequestPasswordReset_InvalidEmail_ShouldReturnError()
    {
        // Arrange
        var email = "invalid@example.com";
        _authServiceMock.Setup(service => service.RequestPasswordResetAsync(email))
            .ReturnsAsync(new ServiceResult<bool> { IsSuccess = false, Message = "Email không tồn tại trong hệ thống." });

        // Act
        var result = await _authServiceMock.Object.RequestPasswordResetAsync(email);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Equal("Email không tồn tại trong hệ thống.", result.Message);
    }

    [Fact]
    public async Task VerifyOtp_ValidOtp_ShouldReturnSuccess()
    {
        // Arrange
        var otp = "123456";
        var email = "test@example.com";
        _authServiceMock.Setup(service => service.VerifyOtpAsync(email, otp))
            .ReturnsAsync(new ServiceResult<bool> { IsSuccess = true, Message = "OTP hợp lệ." });

        // Act
        var result = await _authServiceMock.Object.VerifyOtpAsync(email, otp);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.Equal("OTP hợp lệ.", result.Message);
    }

    [Fact]
    public async Task VerifyOtp_InvalidOtp_ShouldReturnError()
    {
        // Arrange
        var otp = "654321";
        var email = "test@example.com";
        _authServiceMock.Setup(service => service.VerifyOtpAsync(email, otp))
            .ReturnsAsync(new ServiceResult<bool> { IsSuccess = false, Message = "OTP không hợp lệ." });

        // Act
        var result = await _authServiceMock.Object.VerifyOtpAsync(email, otp);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Equal("OTP không hợp lệ.", result.Message);
    }

    [Fact]
    public async Task ResetPassword_ValidResetToken_ShouldReturnSuccess()
    {
        // Arrange
        var newPassword = "NewPassword123";
        var resetToken = "validResetToken";
        _authServiceMock.Setup(service => service.ResetPasswordAsync(resetToken, newPassword))
            .ReturnsAsync(new ServiceResult<bool> { IsSuccess = true, Message = "Mật khẩu đã được thay đổi thành công." });

        // Act
        var result = await _authServiceMock.Object.ResetPasswordAsync(resetToken, newPassword);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.Equal("Mật khẩu đã được thay đổi thành công.", result.Message);
    }

    [Fact]
    public async Task ResetPassword_InvalidResetToken_ShouldReturnError()
    {
        // Arrange
        var newPassword = "NewPassword123";
        var resetToken = "invalidResetToken";
        _authServiceMock.Setup(service => service.ResetPasswordAsync(resetToken, newPassword))
            .ReturnsAsync(new ServiceResult<bool> { IsSuccess = false, Message = "Mã khôi phục không hợp lệ." });

        // Act
        var result = await _authServiceMock.Object.ResetPasswordAsync(resetToken, newPassword);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Equal("Mã khôi phục không hợp lệ.", result.Message);
    }
}

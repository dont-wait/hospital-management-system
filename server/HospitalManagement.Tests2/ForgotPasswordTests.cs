using Xunit;
using Moq;
using Application.Services;
using Application.Common.Utils;
using System.Threading.Tasks;

namespace HospitalManagement.Tests2
{
    public class ForgotPasswordTests
    {
        private readonly Mock<IAuthService> _authServiceMock;
        private readonly Mock<IUserAccountRepository> _userAccountRepositoryMock;
        private readonly Mock<IRedisService> _redisServiceMock;
        private readonly Mock<IOTPService> _otpSenderServiceMock;
        private readonly Mock<ITokenService> _tokenServiceMock;

        public ForgotPasswordTests()
        {
            _authServiceMock = new Mock<IAuthService>();
            _userAccountRepositoryMock = new Mock<IUserAccountRepository>();
            _redisServiceMock = new Mock<IRedisService>();
            _otpSenderServiceMock = new Mock<IOTPService>();
            _tokenServiceMock = new Mock<ITokenService>();
        }

        // Test 1: Yêu cầu khôi phục mật khẩu với email hợp lệ
        [Fact]
        public async Task RequestPasswordReset_ValidEmail_ShouldReturnSuccess()
        {
            // Arrange
            var email = "test@example.com";
            var request = new RequestResetPassword { Email = email };

           _authServiceMock.Setup(service => service.RequestPasswordResetAsync(It.IsAny<RequestResetPassword>()))
                .ReturnsAsync(ServiceResult<string>.Success("Mã OTP đã được gửi đến email."));

            var result = await _authServiceMock.Object.RequestPasswordResetAsync(request);

            Assert.True(result.IsSuccess);
            Assert.Equal("Mã OTP đã được gửi đến email.", result.Data);
        }

        // Test 2: Xác thực OTP hợp lệ
        [Fact]
        public async Task VerifyOtp_ValidOtp_ShouldReturnSuccess()
        {
            // Arrange
            var otp = "123456";
            var email = "test@example.com";
            var request = new RequestVerifyOtp
            {
                Email = email,
                Otp = otp
            };

            _authServiceMock.Setup(service => service.VerifyOtpAsync(It.IsAny<RequestVerifyOtp>()))
                .ReturnsAsync(ServiceResult<ResponseVerifyOtp>.Success(new ResponseVerifyOtp { Message = "OTP hợp lệ." }));

            var result = await _authServiceMock.Object.VerifyOtpAsync(request);

            Assert.True(result.IsSuccess);
            Assert.Equal("OTP hợp lệ.", result.Data.Message);
        }

        // Test 3: Xác thực OTP không hợp lệ
        [Fact]
        public async Task VerifyOtp_InvalidOtp_ShouldReturnError()
        {
            // Arrange
            var otp = "654321";
            var email = "test@example.com";
            var request = new RequestVerifyOtp
            {
                Email = email,
                Otp = otp
            };

            _authServiceMock.Setup(service => service.VerifyOtpAsync(It.IsAny<RequestVerifyOtp>()))
                .ReturnsAsync(ServiceResult<ResponseVerifyOtp>.Fail("OTP không hợp lệ."));

            // Act
            var result = await _authServiceMock.Object.VerifyOtpAsync(request);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal("OTP không hợp lệ.", result.Message);
        }

        // Test 4: Đặt lại mật khẩu với token hợp lệ
        [Fact]
        public async Task ResetPassword_ValidToken_ShouldReturnSuccess()
        {
            // Arrange
            var resetToken = "validResetToken";
            var newPassword = "newSecurePassword";
            var request = new RequestResetPasswordFinal { NewPassword = newPassword };

            _authServiceMock.Setup(service => service.ResetPasswordAsync(It.IsAny<RequestResetPasswordFinal>(), resetToken))
                .ReturnsAsync(ServiceResult<string>.Success("Đặt lại mật khẩu thành công"));

            // Act
            var result = await _authServiceMock.Object.ResetPasswordAsync(request, resetToken);

            // Assert
           Assert.True(result.IsSuccess);
            Assert.Equal("Đặt lại mật khẩu thành công", result.Data);
        }

        // Test 5: Đặt lại mật khẩu với token không hợp lệ
        [Fact]
        public async Task ResetPassword_InvalidToken_ShouldReturnError()
        {
            // Arrange
            var resetToken = "invalidResetToken";
            var newPassword = "newSecurePassword";
            var request = new RequestResetPasswordFinal { NewPassword = newPassword };

            _authServiceMock.Setup(service => service.ResetPasswordAsync(It.IsAny<RequestResetPasswordFinal>(), resetToken))
                .ReturnsAsync(ServiceResult<string>.Fail("Reset token không hợp lệ hoặc đã hết hạn"));

            // Act
            var result = await _authServiceMock.Object.ResetPasswordAsync(request, resetToken);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal("Reset token không hợp lệ hoặc đã hết hạn", result.Message);
        }
    }
}

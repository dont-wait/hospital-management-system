using Application.Common.Utils;

public interface IAuthService
{
    Task<ServiceResult<ResponseLoginDTO?>> LoginSync(RequestLoginDTO loginDto);
    Task<ServiceResult<string>> RequestPasswordResetAsync(RequestResetPassword request);
    Task<ServiceResult<ResponseVerifyOtp>> VerifyOtpAsync(RequestVerifyOtp request);

    Task<ServiceResult<string>> ResetPasswordAsync(RequestResetPasswordFinal request, string resetToken);
}
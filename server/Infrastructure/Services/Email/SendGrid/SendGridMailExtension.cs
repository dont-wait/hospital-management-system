using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Services.Email.SendGrid;
public static class SendGridMailExtension
{
    public static IServiceCollection AddSendGridEmailProvider(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<SendGridSettings>(configuration.GetSection("EmailSettings:SendGrid"));
        services.AddScoped<IEmailService, SendGridEmailService>();

        return services;
    }
}
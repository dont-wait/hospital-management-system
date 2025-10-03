using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Services.Email.Smtp;
public static class SmtpMailExtension
{
    public static IServiceCollection AddSmtpEmailProvider(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<SmtpSettings>(configuration.GetSection("EmailSettings:Smtp"));
        services.AddScoped<IEmailService, SmtpEmailService>();

        return services;
    }
}
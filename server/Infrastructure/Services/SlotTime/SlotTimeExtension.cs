using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Services.SlotTime;
public static class SlotTimeExtension
{
    public static IServiceCollection AddSlotTimeService(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<SlotTimeConfig>()
            .Bind(configuration.GetSection("SlotTimeConfig"))
            .ValidateDataAnnotations()
            .Validate(c => c.SlotDurationMinutes > 0, "SlotDurationMinutes phải lớn hơn 0")
            .ValidateOnStart();
            
        services.AddScoped<ISlotTimeService, SlotTimeService>();
        return services;
    }
}
using Application.Common.Interface.Scheduling;
using Hangfire;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Services.Hangfire;

public static class HangfireExtension
{
    public static IServiceCollection AddHangfireService(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddHangfire(config =>
        {
            config
                .UseSqlServerStorage(configuration.GetConnectionString("SqlServerDb"))
                .UseSimpleAssemblyNameTypeSerializer()
                .UseRecommendedSerializerSettings();
        });

        services.AddHangfireServer(options =>
        {
            options.ServerName = "Hospital Scheduler Worker";
            options.WorkerCount = Math.Min(Environment.ProcessorCount * 5, 10);
            options.SchedulePollingInterval = TimeSpan.FromSeconds(15);
            options.CancellationCheckInterval = TimeSpan.FromSeconds(5);
            options.Queues = new[] { "scheduling", "default" };
        });

        services.AddScoped<IAutoSchedulingBackgroundService, AutoSchedulingBackgroundService>();
        services.AddScoped<AutoSchedulingHangfireJob>();

        return services;
    }
}

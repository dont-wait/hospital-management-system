using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

public static class SignalRExtension
{
    public static IServiceCollection AddSignalRCustom(this IServiceCollection services/*, IConfiguration config*/)
    {
        // bind setting
        //services.Configure<SignalRSetting>(config.GetSection("SignalR"));

        // add signalR
        //services.AddSignalR();

        // add service
        //services.AddScoped<SignalRService>();

        services.AddSignalR();

        return services;
    }
}
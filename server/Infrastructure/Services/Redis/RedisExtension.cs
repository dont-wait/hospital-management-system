using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;

namespace Infrastructure.Services.Redis;
public static class RedisExtension
{
    public static IServiceCollection AddRedisService(this IServiceCollection services, IConfiguration configuration)
    {
        var redisConnectionString = configuration.GetConnectionString("Redis");
        if (string.IsNullOrWhiteSpace(redisConnectionString))
            throw new InvalidOperationException("Không tìm thấy cấu hình Redis");

        try
        {
            services.AddSingleton<IConnectionMultiplexer>(
                ConnectionMultiplexer.Connect(redisConnectionString)
            );
            Console.WriteLine("Đã kết nối với Redis");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Lỗi kết nối Redis: {ex.Message}");
            throw;
        }

        services.AddScoped<IRedisService, RedisService>();

        return services;
    }
}
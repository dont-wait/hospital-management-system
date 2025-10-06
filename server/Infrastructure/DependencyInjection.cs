using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Services.Token;
using Infrastructure.Services.Swagger;
using Infrastructure.Services.Email.Smtp;
using Infrastructure.Services.Email.SendGrid;
using Infrastructure.Services.Redis;
using Infrastructure.Services.Email;

namespace Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        try
        {
            string DbProvider = configuration.GetValue<string>("DatabaseProvider") ?? "SqlServer";
            if (DbProvider == "SqlServer")
            {
                services.AddDbContext<AppDbContext>(options =>
                    options.UseSqlServer(configuration.GetConnectionString("SqlServerDb")));

                Console.WriteLine("Đã kết nối với SQL Server");
            }
            else if (DbProvider == "Oracle")
            {
                services.AddDbContext<AppDbContext>(options =>
                    options.UseOracle(configuration.GetConnectionString("OracleDb")));

                Console.WriteLine("Đã kết nối với Oracle Database");
            }
            else
            {
                throw new Exception("Nhà cung cấp cơ sở dữ liệu không được hỗ trợ.");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Lỗi khi thiết lập kết nối cơ sở dữ liệu: {ex.Message}");
            throw;
        }

        services.AddTokenService(configuration);
        services.AddSwaggerDocumentation();
        services.AddRedisService(configuration);

        if (configuration.GetValue<string>("EmailSettings:Provider") == "Smtp")
        {
            services.AddSmtpEmailProvider(configuration);
        }
        else
        {
            services.AddSendGridEmailProvider(configuration);
        }

        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IOTPService, SendOTPService>();

        return services;
    }
}
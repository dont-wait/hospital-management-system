using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Services.Token;
using Infrastructure.Services.Swagger;
using Infrastructure.Services.Email.Smtp;
using Infrastructure.Services.Email.SendGrid;
using Infrastructure.Services.Redis;
using Infrastructure.Services.Email;
using Infrastructure.Services.SlotTime;
using Infrastructure.Services.Excel;
using Hangfire;

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
        services.AddSlotTimeService(configuration);
        services.AddExcelExporter();

        if (configuration.GetValue<string>("EmailSettings:Provider") == "Smtp")
        {
            services.AddSmtpEmailProvider(configuration);
        }
        else
        {
            services.AddSendGridEmailProvider(configuration);
        }
        //Hangfire configuration
        services.AddHangfire(config =>
        {
            config
                .UseSqlServerStorage(configuration.GetConnectionString("SqlServerDb"))
                .UseSimpleAssemblyNameTypeSerializer() //serialize shortname class
                .UseRecommendedSerializerSettings() // normallize json setting
                ;

        });
        services.AddHangfireServer(opts =>
        {
            opts.ServerName = "Hospital Scheduler Worker"; // Tên của hangfire server
            opts.WorkerCount = Math.Min(Environment.ProcessorCount * 5, 10); // Số lượng worker để xử lý công việc
            opts.SchedulePollingInterval = TimeSpan.FromSeconds(15); // Khoảng thời gian để hangfire server kiểm tra job trong db 
            opts.CancellationCheckInterval = TimeSpan.FromSeconds(5); // Khoảng thời gian để hangfire server kiểm tra job có bị hủy hay không để dùng job tránh lãng phí worker và tài nguyên hệ thống
        });

        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IOTPService, SendOTPService>();
        services.AddScoped<IEmailTemplateService, SendEmailTemplateService>();

        return services;
    }
}

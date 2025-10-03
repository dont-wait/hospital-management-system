using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Infrastructure.Services.Token;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Services.Swagger;

namespace Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
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

        services.AddTokenService(configuration);
        services.AddSwaggerDocumentation();

        return services;
    }
}
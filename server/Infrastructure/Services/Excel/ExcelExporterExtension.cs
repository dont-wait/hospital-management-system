using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Services.Excel;
public static class ExcelExporterExtension
{
    public static IServiceCollection AddExcelExporter(this IServiceCollection services)
    {
        services.AddScoped<IExcelExporter, ExcelExporter>();
        return services;
    }
}
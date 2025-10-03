using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Text;

namespace Infrastructure.Services.Token;
public static class TokenExtension
{
    public static IServiceCollection AddTokenService(this IServiceCollection services, IConfiguration config)
    {
        services.Configure<JwtSettings>(config.GetSection("JwtSettings"));

        var jwtSettings = config.GetSection("JwtSettings").Get<JwtSettings>();
        return services;
    }
}
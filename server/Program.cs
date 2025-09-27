using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using HospitalManagementSystem.Configs;
using HospitalManagementSystem.Services.Account;
using HospitalManagementSystem.Services.Auth;

using HospitalManagementSystem.Repositories.Account;
using HospitalManagementSystem.Repositories.Employees;
using StackExchange.Redis;
using server.Services;

var builder = WebApplication.CreateBuilder(args);

var dbProvider = builder.Configuration.GetValue<string>("DatabaseProvider");
if (dbProvider == "SqlServer")
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("SqlServerDb")));

    Console.WriteLine("Đã kết nối với SQL Server");
}
else if (dbProvider == "Oracle")
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseOracle(builder.Configuration.GetConnectionString("OracleDb")));

    Console.WriteLine("Đã kết nối với Oracle Database");
}
else
{
    throw new Exception("Không tìm thấy CSDL phù hợp");
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy
            //.WithOrigins("http://localhost:5500")
            .SetIsOriginAllowed(_ => true)
            .AllowCredentials()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument(config =>
{
    config.DocumentName = "Hospital Management System API";
    config.Title = "Hospital Management System API";
    config.Version = "v1";

    config.AddSecurity("JWT", new NSwag.OpenApiSecurityScheme
    {
        Type = NSwag.OpenApiSecuritySchemeType.ApiKey,
        Name = "Authorization",
        In = NSwag.OpenApiSecurityApiKeyLocation.Header,
        Description = "Nhập: Bearer {token}"
    });

    config.OperationProcessors.Add(new NSwag.Generation.Processors.Security.AspNetCoreOperationSecurityScopeProcessor("JWT"));
});

builder.Services.AddRouting(options =>
{
    options.LowercaseUrls = true;
    options.LowercaseQueryStrings = true;
});
// Config JWT Authentication
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
var jwtSettings = new JwtSettings();
builder.Configuration.GetSection("JwtSettings").Bind(jwtSettings);

ProgramGlobals.JwtSettingsInstance = jwtSettings;

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtSettings.Issuer,

            ValidateAudience = true,
            ValidAudience = jwtSettings.Audience,

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key)),

            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero,

            RoleClaimType = "RoleId",
        };
    });

// Config Redis
var redisConnectionString = builder.Configuration.GetConnectionString("Redis");
if (string.IsNullOrWhiteSpace(redisConnectionString))
    throw new InvalidOperationException("Không tìm thấy cấu hình Redis");

builder.Services.AddSingleton<IConnectionMultiplexer>(
    ConnectionMultiplexer.Connect(redisConnectionString)
);

// Config DI for Email services

var emailProvider = builder.Configuration["EmailSettings:Provider"];
if (emailProvider == "SendGrid")
{
    builder.Services.AddScoped<IEmailProvider, SendGridEmailProvider>();
}
else if (emailProvider == "Smtp")
{
    builder.Services.AddScoped<IEmailProvider, SmtpEmailProvider>();
}
else
{
    throw new Exception("Không tìm thấy nhà cung cấp dịch vụ email phù hợp");
}
builder.Services.AddScoped<IEmailSenderService, EmailSenderService>();

builder.Services.AddAuthorization();
builder.Services.AddHttpContextAccessor();

builder.Services.AddScoped<IUserAccountService, UserAccountService>();
builder.Services.AddScoped<IUserAccountRepository, UserAccountRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmployeeAccountService, EmployeeAccountService>();
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<IRedisService, RedisService>();


builder.Logging.ClearProviders();
builder.Logging.AddConsole();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await DataSeeder.SeedAsync(db);
}

    app.UseCors("CorsPolicy");
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseOpenApi();
    app.UseSwaggerUi(config =>
    {
        config.DocumentTitle = "Hospital Management System API";
        config.Path = "/swagger";
        config.DocumentPath = "/swagger/{documentName}/swagger.json";
        config.DocExpansion = "list";
    });
}
else
{
    app.UseExceptionHandler("/error");
    app.UseHsts();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/", () => "Hello World!");

app.Run();
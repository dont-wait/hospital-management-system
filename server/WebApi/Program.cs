using Infrastructure;
using Infrastructure.Persistence.Repositories.Account;
using Infrastructure.Persistence.Repositories.EmployeeRepository;
using Application.Services.Auth;
using Application.Services.Account;
using Application.Services.Admin;
using WebApi.Services;
using WebApi.Middleware;
using Hangfire;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy
            .SetIsOriginAllowed(origin =>
                origin == "http://localhost:3000" ||
                origin.EndsWith(".vercel.app"))
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddRouting(options =>
{
    options.LowercaseUrls = true;
    options.LowercaseQueryStrings = true;
});


builder.Services.AddAuthorization();
builder.Services.AddHttpContextAccessor();

builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddScoped<IUserAccountService, UserAccountService>();
builder.Services.AddScoped<IUserAccountRepository, UserAccountRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmployeeAccountService, EmployeeAccountService>();
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
builder.Services.AddScoped<IDepartmentService, DepartmentService>();
builder.Services.AddScoped<IDepartmentRepository, DepartmentRepository>();
builder.Services.AddScoped<ITaskItemRepository, TaskItemRepository>();
builder.Services.AddScoped<ITaskItemService, TaskItemService>();
builder.Services.AddScoped<ISlotTimeRepository, SlotTimeRepository>();
builder.Services.AddScoped<IBillingRepository, BillingRepository>();
builder.Services.AddScoped<ISlotTimeService, SlotTimeService>();
builder.Services.AddScoped<IRoomRepository, RoomRepository>();
builder.Services.AddScoped<IRoomService, RoomService>();
builder.Services.AddScoped<IBillingService, BillingService>();
builder.Services.AddScoped<IMedicalVisitService, MedicalVisitService>();
builder.Services.AddScoped<IMedicalVisitRepository, MedicalVisitRepository>();
builder.Services.AddScoped<IPrescriptionRepository, PrescriptionRepository>();
builder.Services.AddScoped<IPrescriptionService, PrescriptionSerivce>();
builder.Services.AddScoped<IServiceRepository, ServiceRepository>();
builder.Services.AddScoped<IBackupRepository, BackupRepository>();
builder.Services.AddScoped<IBackupService, BackupService>();

builder.Services.AddScoped<IUserAccountMapper, UserAccountMapper>();
builder.Services.AddScoped<IPatientMapper, PatientMapper>();
builder.Services.AddScoped<IDoctorMapper, DoctorMapper>();
builder.Services.AddScoped<IEmployeeMapper, EmployeeMapper>();

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    try
    {
        logger.LogInformation("Applying migrations...");
        await db.Database.MigrateAsync();
        logger.LogInformation("Migrations applied successfully.");
    await DataSeeder.SeedDepartmentsAndRoomAsync(db);
    await DataSeeder.SeedAsync(db);
    await DataSeeder.SeedSysAdminAsync(db);
    await DataSeeder.SeedAdminAsync(db);
    await DataSeeder.SeedDoctorsAsync(db);
    await DataSeeder.SeedServicesAsync(db);
    await DataSeeder.SeedPatientsAsync(db);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while migrating or seeding the database.");
    }


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

app.UseMiddleware<CookieToHeaderMiddleware>();

app.UseHangfireDashboard("/hangfire", new DashboardOptions
{
    Authorization = new[] { new HangfireAuthorizationFilter() },
    DashboardTitle = "Hospital Management - Backup Jobs"
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/", () => "Hello World!");
app.MapGet("/health", () => Results.Ok(new 
{ 
    status = "Healthy",
    timestamp = DateTime.UtcNow,
    version = "1.0.0"
}))
.AllowAnonymous();

app.Run();
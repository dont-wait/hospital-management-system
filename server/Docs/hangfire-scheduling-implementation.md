# Triển khai Hangfire + SignalR — Xếp lịch Tự động

> **Mục đích:** Hướng dẫn từng bước để tích hợp Hangfire (background job) + SignalR (real-time notification) cho tính năng xếp lịch tự động.
> **Dựa trên:** Codebase hiện tại + `scheduling-feature-doc.md`

---

## Mục lục

1. [Tổng quan](#1-tổng-quan)
2. [Fix cài đặt Hangfire hiện tại](#2-fix-cài-đặt-hangfire-hiện-tại)
3. [Phase 1 — Domain Layer](#3-phase-1--domain-layer)
4. [Phase 2 — Application Layer](#4-phase-2--application-layer)
5. [Phase 3 — Infrastructure Layer](#5-phase-3--infrastructure-layer)
6. [Phase 4 — WebApi Layer (Controller, Hub, Notification)](#6-phase-4--webapi-layer)
7. [Phase 5 — Database Migration](#7-phase-5--database-migration)
8. [Phase 6 — Client (Next.js)](#8-phase-6--client)
9. [Phase 7 — Config & Final](#9-phase-7--config--final)
10. [Checklist tổng hợp](#10-checklist-tổng-hợp)

---

## 1. Tổng quan

### Luồng chính

```
HOD bấm "Xếp lịch"
  → POST /api/scheduling/generate
  → tạo ScheduleRequest (PENDING)
  → Enqueue Hangfire Job
  → trả HTTP 202 Accepted

Hangfire Worker pick job
  → gọi Python Service (HTTP)
  → nhận kết quả
  → lưu ScheduleData JSON
  → update status = READY
  → push SignalR cho HOD

HOD xem → bấm "Gửi Giám đốc"
  → update PENDING_APPROVAL
  → push SignalR cho Giám đốc

Giám đốc duyệt
  → update APPROVED
  → push SignalR cho tất cả bác sĩ khoa
```

### State machine

```
NONE → PENDING → READY → PENDING_APPROVAL → APPROVED
                                           ↘ REJECTED → READY
```

### File cần tạo/sửa (tổng ~26 files)

| Phase | Files | Loại |
|---|---|---|
| Fix Hangfire | 2 files | Sửa |
| Domain | 3 files | Tạo mới |
| Application | 4 files | Tạo mới |
| Infrastructure | 4 files | Tạo mới + sửa |
| WebApi | 5 files | Tạo mới + sửa |
| Database | 1 file | Migration |
| Config | 2 files | Sửa |
| Client | 4 files | Tạo mới |

---

## 2. Fix cài đặt Hangfire hiện tại

### 2.1 Fix `HangfireAuthorizationFilter` — chỉ cho Admin

**File:** `WebApi/Middleware/HangfireAuthorizationFilter.cs`

**Trước (hiện tại):**
```csharp
public bool Authorize(DashboardContext context)
{
    return true; // ❌ Ai cũng vào được
}
```

**Sau (cần sửa):**
```csharp
using Hangfire.Dashboard;
using Microsoft.AspNetCore.Http;

namespace WebApi.Middleware;

public class HangfireAuthorizationFilter : IDashboardAuthorizationFilter
{
    public bool Authorize(DashboardContext context)
    {
        var httpContext = context.GetHttpContext();

        // Cho phép trong Development
        var env = httpContext.RequestServices
            .GetRequiredService<IWebHostEnvironment>();
        if (env.IsDevelopment())
            return true;

        // Production: chỉ Admin mới được truy cập
        var user = httpContext.User;
        return user.Identity?.IsAuthenticated == true
            && user.IsInRole("Admin");
    }
}
```

### 2.2 Thêm `CompatibilityLevel` + đổi Dashboard Title

**File:** `Infrastructure/DependencyInjection.cs`

Sửa đoạn Hangfire config:

```csharp
//Hangfire configuration
services.AddHangfire(config =>
{
    config
        .SetDataCompatibilityLevel(CompatibilityLevel.Version_180) // THÊM
        .UseSqlServerStorage(configuration.GetConnectionString("SqlServerDb"))
        .UseSimpleAssemblyNameTypeSerializer()
        .UseRecommendedSerializerSettings();
});

services.AddHangfireServer(opts =>
{
    opts.ServerName = "Hospital Scheduler Worker";
    opts.WorkerCount = Math.Min(Environment.ProcessorCount * 5, 10);
    opts.SchedulePollingInterval = TimeSpan.FromSeconds(15);
    opts.CancellationCheckInterval = TimeSpan.FromSeconds(5);
    opts.Queues = new[] { "scheduling", "notifications", "default" }; // THÊM
});
```

**File:** `WebApi/Program.cs`

```csharp
app.UseHangfireDashboard("/hangfire", new DashboardOptions
{
    Authorization = new[] { new HangfireAuthorizationFilter() },
    DashboardTitle = "Hospital Management - Background Jobs" // SỬA
});
```

---

## 3. Phase 1 — Domain Layer

### 3.1 `ScheduleStatusEnum`

**File:** `Domain/Enums/ScheduleStatusEnum.cs` (tạo mới)

```csharp
namespace Domain.Enums;

public enum ScheduleStatusEnum
{
    Pending,
    Ready,
    PendingApproval,
    Approved,
    Rejected,
    Failed
}
```

### 3.2 `ScheduleRequest`

**File:** `Domain/Entities/ScheduleTask/ScheduleRequest.cs` (tạo mới)

```csharp
using Domain.Entities;
using Domain.Enums;

namespace Domain.Entities.ScheduleTask;

public class ScheduleRequest : BaseEntity
{
    public int Id { get; set; }
    public int DepartmentId { get; set; }
    public virtual Department? Department { get; set; }
    public Guid RequestedBy { get; set; }
    public virtual Employee? Employee { get; set; }
    public ScheduleStatusEnum Status { get; set; }
    public string? HangfireJobId { get; set; }
    public string? ScheduleData { get; set; }
    public DateOnly PeriodStart { get; set; }
    public DateOnly PeriodEnd { get; set; }
    public ICollection<ScheduleApproval> Approvals { get; set; } = [];
}
```

### 3.3 `ScheduleApproval`

**File:** `Domain/Entities/ScheduleTask/ScheduleApproval.cs` (tạo mới)

```csharp
using Domain.Entities;

namespace Domain.Entities.ScheduleTask;

public class ScheduleApproval : BaseEntity
{
    public int Id { get; set; }
    public int ScheduleRequestId { get; set; }
    public virtual ScheduleRequest? ScheduleRequest { get; set; }
    public Guid ApprovedBy { get; set; }
    public virtual Employee? Approver { get; set; }
    public string Decision { get; set; } = string.Empty;
    public string? Comment { get; set; }
    public DateTimeOffset DecisionAt { get; set; }
}
```

### 3.4 Thêm DbSet vào `AppDbContext`

**File:** `Infrastructure/Persistence/AppDbContext.cs` — thêm:

```csharp
public DbSet<ScheduleRequest> schedule_requests { get; set; }
public DbSet<ScheduleApproval> schedule_approvals { get; set; }
```

Thêm navigation properties vào `Department` và `Employee` nếu cần:

```csharp
// Trong Department.cs
public ICollection<ScheduleRequest> ScheduleRequests { get; set; } = [];

// Trong Employee.cs
public ICollection<ScheduleRequest> ScheduleRequests { get; set; } = [];
```

---

## 4. Phase 2 — Application Layer

### 4.1 Interface — `IScheduleRequestRepository`

**File:** `Application/Common/Interface/Scheduling/IScheduleRequestRepository.cs` (tạo mới)

```csharp
using Domain.Entities.ScheduleTask;

namespace Application.Common.Interface.Scheduling;

public interface IScheduleRequestRepository
{
    Task<ScheduleRequest> AddAsync(ScheduleRequest request);
    Task<ScheduleRequest?> GetByIdAsync(int id);
    Task UpdateAsync(ScheduleRequest request);
    Task<List<ScheduleRequest>> GetByDepartmentIdAsync(int departmentId);
}
```

### 4.2 Interface — `IScheduleApprovalRepository`

**File:** `Application/Common/Interface/Scheduling/IScheduleApprovalRepository.cs` (tạo mới)

```csharp
using Domain.Entities.ScheduleTask;

namespace Application.Common.Interface.Scheduling;

public interface IScheduleApprovalRepository
{
    Task<ScheduleApproval> AddAsync(ScheduleApproval approval);
    Task<List<ScheduleApproval>> GetByRequestIdAsync(int requestId);
}
```

### 4.3 Interface — `IPythonSchedulingClient`

**File:** `Application/Common/Interface/Scheduling/IPythonSchedulingClient.cs` (tạo mới)

```csharp
namespace Application.Common.Interface.Scheduling;

public interface IPythonSchedulingClient
{
    Task<string> GenerateScheduleAsync(int departmentId, DateOnly periodStart, DateOnly periodEnd);
}
```

### 4.4 DTOs

**File:** `Application/Common/DTOs/Scheduling/RequestGenerateScheduleDTO.cs` (tạo mới)

```csharp
namespace Application.Common.DTOs.Scheduling;

public class RequestGenerateScheduleDTO
{
    public int DepartmentId { get; set; }
    public DateOnly PeriodStart { get; set; }
    public DateOnly PeriodEnd { get; set; }
}
```

**File:** `Application/Common/DTOs/Scheduling/ResponseScheduleRequestDTO.cs` (tạo mới)

```csharp
using Domain.Enums;

namespace Application.Common.DTOs.Scheduling;

public class ResponseScheduleRequestDTO
{
    public int Id { get; set; }
    public int DepartmentId { get; set; }
    public string? DepartmentName { get; set; }
    public Guid RequestedBy { get; set; }
    public string? RequestedByName { get; set; }
    public ScheduleStatusEnum Status { get; set; }
    public string? HangfireJobId { get; set; }
    public string? ScheduleData { get; set; }
    public DateOnly PeriodStart { get; set; }
    public DateOnly PeriodEnd { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
}
```

**File:** `Application/Common/DTOs/Scheduling/RequestApproveScheduleDTO.cs` (tạo mới)

```csharp
namespace Application.Common.DTOs.Scheduling;

public class RequestApproveScheduleDTO
{
    public string? Comment { get; set; }
}
```

---

## 5. Phase 3 — Infrastructure Layer

### 5.1 `ScheduleRequestRepository`

**File:** `Infrastructure/Persistence/Repositories/Scheduling/ScheduleRequestRepository.cs` (tạo mới)

```csharp
using Application.Common.Interface.Scheduling;
using Domain.Entities.ScheduleTask;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories.Scheduling;

public class ScheduleRequestRepository : IScheduleRequestRepository
{
    private readonly AppDbContext _context;

    public ScheduleRequestRepository(AppDbContext context) => _context = context;

    public async Task<ScheduleRequest> AddAsync(ScheduleRequest request)
    {
        _context.schedule_requests.Add(request);
        await _context.SaveChangesAsync();
        return request;
    }

    public async Task<ScheduleRequest?> GetByIdAsync(int id)
    {
        return await _context.schedule_requests
            .Include(r => r.Department)
            .Include(r => r.Employee)
            .Include(r => r.Approvals)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task UpdateAsync(ScheduleRequest request)
    {
        request.UpdatedAt = DateTimeOffset.UtcNow;
        _context.schedule_requests.Update(request);
        await _context.SaveChangesAsync();
    }

    public async Task<List<ScheduleRequest>> GetByDepartmentIdAsync(int departmentId)
    {
        return await _context.schedule_requests
            .Where(r => r.DepartmentId == departmentId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }
}
```

### 5.2 `ScheduleApprovalRepository`

**File:** `Infrastructure/Persistence/Repositories/Scheduling/ScheduleApprovalRepository.cs` (tạo mới)

```csharp
using Application.Common.Interface.Scheduling;
using Domain.Entities.ScheduleTask;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories.Scheduling;

public class ScheduleApprovalRepository : IScheduleApprovalRepository
{
    private readonly AppDbContext _context;

    public ScheduleApprovalRepository(AppDbContext context) => _context = context;

    public async Task<ScheduleApproval> AddAsync(ScheduleApproval approval)
    {
        _context.schedule_approvals.Add(approval);
        await _context.SaveChangesAsync();
        return approval;
    }

    public async Task<List<ScheduleApproval>> GetByRequestIdAsync(int requestId)
    {
        return await _context.schedule_approvals
            .Where(a => a.ScheduleRequestId == requestId)
            .OrderByDescending(a => a.DecisionAt)
            .ToListAsync();
    }
}
```

### 5.3 `PythonSchedulingClient`

**File:** `Infrastructure/PythonClient/PythonSchedulingClient.cs` (tạo mới)

```csharp
using System.Net.Http.Json;
using Application.Common.Interface.Scheduling;
using Microsoft.Extensions.Logging;

namespace Infrastructure.PythonClient;

public class PythonSchedulingClient : IPythonSchedulingClient
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<PythonSchedulingClient> _logger;

    public PythonSchedulingClient(HttpClient httpClient, ILogger<PythonSchedulingClient> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<string> GenerateScheduleAsync(
        int departmentId, DateOnly periodStart, DateOnly periodEnd)
    {
        var payload = new
        {
            department_id = departmentId,
            period_start = periodStart.ToString("yyyy-MM-dd"),
            period_end = periodEnd.ToString("yyyy-MM-dd")
        };

        _logger.LogInformation(
            "Calling Python scheduling service for department {DepartmentId}", departmentId);

        var response = await _httpClient.PostAsJsonAsync("/api/schedule/generate", payload);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadAsStringAsync();

        _logger.LogInformation(
            "Python service returned schedule data for department {DepartmentId}", departmentId);

        return result;
    }
}
```

### 5.4 `SchedulingJob` — Hangfire Job chính

**File:** `Infrastructure/HangfireJobs/SchedulingJob.cs` (tạo mới)

```csharp
using Application.Common.Interface.Scheduling;
using Domain.Enums;
using Hangfire;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using WebApi.Hubs;
using WebApi.Services;

namespace Infrastructure.HangfireJobs;

public class SchedulingJob
{
    private readonly IPythonSchedulingClient _pythonClient;
    private readonly IScheduleRequestRepository _requestRepo;
    private readonly NotificationService _notification;
    private readonly ILogger<SchedulingJob> _logger;

    public SchedulingJob(
        IPythonSchedulingClient pythonClient,
        IScheduleRequestRepository requestRepo,
        NotificationService notification,
        ILogger<SchedulingJob> logger)
    {
        _pythonClient = pythonClient;
        _requestRepo = requestRepo;
        _notification = notification;
        _logger = logger;
    }

    [AutomaticRetry(Attempts = 3, DelaysInSeconds = new[] { 60, 120, 300 })]
    public async Task ExecuteAsync(int requestId, Guid userId)
    {
        _logger.LogInformation(
            "SchedulingJob started for RequestId={RequestId}", requestId);

        var request = await _requestRepo.GetByIdAsync(requestId);
        if (request == null)
        {
            _logger.LogError("ScheduleRequest {RequestId} not found", requestId);
            return;
        }

        try
        {
            // 1. Gọi Python service
            var scheduleData = await _pythonClient.GenerateScheduleAsync(
                request.DepartmentId,
                request.PeriodStart,
                request.PeriodEnd);

            // 2. Lưu kết quả, update status
            request.ScheduleData = scheduleData;
            request.Status = ScheduleStatusEnum.Ready;
            await _requestRepo.UpdateAsync(request);

            _logger.LogInformation(
                "SchedulingJob completed for RequestId={RequestId}", requestId);

            // 3. Push SignalR cho HOD
            await _notification.NotifyScheduleReadyAsync(userId, requestId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "SchedulingJob failed for RequestId={RequestId}", requestId);

            request.Status = ScheduleStatusEnum.Failed;
            await _requestRepo.UpdateAsync(request);

            // Push lỗi cho HOD
            await _notification.NotifyScheduleFailedAsync(userId, ex.Message);

            throw; // Re-throw để Hangfire retry
        }
    }
}
```

### 5.5 Đăng ký DI

**File:** `Infrastructure/DependencyInjection.cs` — thêm cuối cùng trước `return services;`:

```csharp
using Application.Common.Interface.Scheduling;
using Infrastructure.HangfireJobs;
using Infrastructure.Persistence.Repositories.Scheduling;
using Infrastructure.PythonClient;

// Thêm các dòng này:
services.AddScoped<IScheduleRequestRepository, ScheduleRequestRepository>();
services.AddScoped<IScheduleApprovalRepository, ScheduleApprovalRepository>();
services.AddHttpClient<IPythonSchedulingClient, PythonSchedulingClient>(client =>
{
    var baseUrl = configuration.GetValue<string>("PythonService:BaseUrl")
        ?? "http://localhost:8000";
    client.BaseAddress = new Uri(baseUrl);
    client.Timeout = TimeSpan.FromMinutes(5); // Python có thể xử lý lâu
});
services.AddScoped<SchedulingJob>();
```

---

## 6. Phase 4 — WebApi Layer

### 6.1 `SchedulingHub` — SignalR Hub

**File:** `WebApi/Hubs/SchedulingHub.cs` (tạo mới)

```csharp
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace WebApi.Hubs;

[Authorize]
public class SchedulingHub : Hub
{
    private readonly ILogger<SchedulingHub> _logger;

    public SchedulingHub(ILogger<SchedulingHub> logger) => _logger = logger;

    public override async Task OnConnectedAsync()
    {
        var userId = Context.UserIdentifier;
        _logger.LogInformation("SignalR connected: UserId={UserId}, ConnectionId={ConnId}",
            userId, Context.ConnectionId);
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        _logger.LogInformation("SignalR disconnected: UserId={UserId}", Context.UserIdentifier);
        await base.OnDisconnectedAsync(exception);
    }

    /// <summary>
    /// Bác sĩ join group của khoa để nhận thông báo lịch
    /// </summary>
    public async Task JoinDepartmentGroup(int departmentId)
    {
        var role = Context.User?.FindFirst(ClaimTypes.Role)?.Value;
        if (role is "Doctor" or "Employee" or "Hod" or "Admin")
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"dept_{departmentId}");
            _logger.LogInformation("User {UserId} joined dept_{DeptId}",
                Context.UserIdentifier, departmentId);
        }
    }

    /// <summary>
    /// Giám đốc join group riêng để nhận thông báo phê duyệt
    /// </summary>
    public async Task JoinDirectorGroup()
    {
        var role = Context.User?.FindFirst(ClaimTypes.Role)?.Value;
        if (role == "Admin")
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "directors");
            _logger.LogInformation("Director {UserId} joined directors group",
                Context.UserIdentifier);
        }
    }
}
```

### 6.2 `NotificationService`

**File:** `WebApi/Services/NotificationService.cs` (tạo mới)

```csharp
using Microsoft.AspNetCore.SignalR;
using WebApi.Hubs;

namespace WebApi.Services;

public class NotificationService
{
    private readonly IHubContext<SchedulingHub> _hub;

    public NotificationService(IHubContext<SchedulingHub> hub) => _hub = hub;

    /// <summary>
    /// Giai đoạn 1: Lịch xếp xong → notify HOD
    /// </summary>
    public async Task NotifyScheduleReadyAsync(Guid userId, int requestId)
    {
        await _hub.Clients.User(userId.ToString()).SendAsync("ScheduleReady", new
        {
            requestId,
            message = "Lịch đã được xếp xong. Bấm để xem và xác nhận.",
            timestamp = DateTime.UtcNow
        });
    }

    /// <summary>
    /// Giai đoạn 2: HOD gửi duyệt → notify Giám đốc
    /// </summary>
    public async Task NotifyDirectorAsync(int requestId, int departmentId, string departmentName)
    {
        await _hub.Clients.Group("directors").SendAsync("NewApprovalRequest", new
        {
            requestId,
            departmentId,
            departmentName,
            message = $"Lịch khoa {departmentName} cần phê duyệt.",
            timestamp = DateTime.UtcNow
        });
    }

    /// <summary>
    /// Giai đoạn 3: Giám đốc duyệt → notify tất cả bác sĩ trong khoa
    /// </summary>
    public async Task NotifyDoctorsApprovedAsync(int departmentId, int requestId)
    {
        await _hub.Clients.Group($"dept_{departmentId}").SendAsync("ScheduleApproved", new
        {
            requestId,
            departmentId,
            message = "Lịch làm việc đã được phê duyệt. Xem ngay!",
            timestamp = DateTime.UtcNow
        });
    }

    /// <summary>
    /// Giám đốc từ chối → notify HOD
    /// </summary>
    public async Task NotifyScheduleRejectedAsync(Guid hodUserId, int requestId, string reason)
    {
        await _hub.Clients.User(hodUserId.ToString()).SendAsync("ScheduleRejected", new
        {
            requestId,
            reason,
            message = "Lịch đã bị từ chối. Vui lòng chỉnh sửa và gửi lại.",
            timestamp = DateTime.UtcNow
        });
    }

    /// <summary>
    /// Job thất bại → notify HOD
    /// </summary>
    public async Task NotifyScheduleFailedAsync(Guid userId, string reason)
    {
        await _hub.Clients.User(userId.ToString()).SendAsync("ScheduleFailed", new
        {
            reason,
            message = "Xếp lịch thất bại. Vui lòng thử lại.",
            timestamp = DateTime.UtcNow
        });
    }
}
```

### 6.3 `SchedulingController`

**File:** `WebApi/Controllers/Scheduling/SchedulingController.cs` (tạo mới)

```csharp
using System.Security.Claims;
using Application.Common.DTOs.Scheduling;
using Application.Common.Interface.Scheduling;
using Application.Common.Utils;
using Domain.Entities.ScheduleTask;
using Domain.Enums;
using Hangfire;
using Infrastructure.HangfireJobs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Services;

namespace WebApi.Controllers.Scheduling;

[ApiController]
[Route("api/scheduling")]
[Authorize]
public class SchedulingController : ControllerBase
{
    private readonly IBackgroundJobClient _backgroundJobClient;
    private readonly IScheduleRequestRepository _requestRepo;
    private readonly IScheduleApprovalRepository _approvalRepo;
    private readonly NotificationService _notification;
    private readonly ILogger<SchedulingController> _logger;

    public SchedulingController(
        IBackgroundJobClient backgroundJobClient,
        IScheduleRequestRepository requestRepo,
        IScheduleApprovalRepository approvalRepo,
        NotificationService notification,
        ILogger<SchedulingController> logger)
    {
        _backgroundJobClient = backgroundJobClient;
        _requestRepo = requestRepo;
        _approvalRepo = approvalRepo;
        _notification = notification;
        _logger = logger;
    }

    /// <summary>
    /// HOD bấm "Xếp lịch tự động" → enqueue Hangfire job, trả 202
    /// </summary>
    [HttpPost("generate")]
    [Authorize(Roles = "Admin,Hod")]
    public async Task<IActionResult> GenerateSchedule([FromBody] RequestGenerateScheduleDTO dto)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var request = new ScheduleRequest
            {
                DepartmentId = dto.DepartmentId,
                RequestedBy = userId,
                Status = ScheduleStatusEnum.Pending,
                PeriodStart = dto.PeriodStart,
                PeriodEnd = dto.PeriodEnd,
                CreatedAt = DateTimeOffset.UtcNow
            };
            await _requestRepo.AddAsync(request);

            var jobId = _backgroundJobClient.Enqueue<SchedulingJob>(
                job => job.ExecuteAsync(request.Id, userId));

            request.HangfireJobId = jobId;
            await _requestRepo.UpdateAsync(request);

            _logger.LogInformation(
                "Schedule generation enqueued: RequestId={RequestId}, JobId={JobId}",
                request.Id, jobId);

            return Accepted(new
            {
                requestId = request.Id,
                jobId,
                message = "Đang xử lý xếp lịch. Bạn có thể tiếp tục thao tác khác."
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error enqueuing schedule generation");
            return StatusCode(500, new { message = "Có lỗi xảy ra khi khởi tạo xếp lịch." });
        }
    }

    /// <summary>
    /// HOD xem kết quả xếp lịch
    /// </summary>
    [HttpGet("{requestId}")]
    [Authorize(Roles = "Admin,Hod")]
    public async Task<IActionResult> GetScheduleRequest(int requestId)
    {
        try
        {
            var request = await _requestRepo.GetByIdAsync(requestId);
            if (request == null)
                return NotFound(new { message = "Không tìm thấy yêu cầu xếp lịch." });

            return Ok(new ResponseScheduleRequestDTO
            {
                Id = request.Id,
                DepartmentId = request.DepartmentId,
                DepartmentName = request.Department?.Name,
                RequestedBy = request.RequestedBy,
                Status = request.Status,
                HangfireJobId = request.HangfireJobId,
                ScheduleData = request.ScheduleData,
                PeriodStart = request.PeriodStart,
                PeriodEnd = request.PeriodEnd,
                CreatedAt = request.CreatedAt,
                UpdatedAt = request.UpdatedAt
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting schedule request {RequestId}", requestId);
            return StatusCode(500, new { message = "Có lỗi xảy ra." });
        }
    }

    /// <summary>
    /// HOD xem danh sách yêu cầu xếp lịch của khoa
    /// </summary>
    [HttpGet("department/{departmentId}")]
    [Authorize(Roles = "Admin,Hod")]
    public async Task<IActionResult> GetByDepartment(int departmentId)
    {
        try
        {
            var requests = await _requestRepo.GetByDepartmentIdAsync(departmentId);
            var result = requests.Select(r => new ResponseScheduleRequestDTO
            {
                Id = r.Id,
                DepartmentId = r.DepartmentId,
                Status = r.Status,
                PeriodStart = r.PeriodStart,
                PeriodEnd = r.PeriodEnd,
                CreatedAt = r.CreatedAt,
                UpdatedAt = r.UpdatedAt
            });
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting requests for department {DeptId}", departmentId);
            return StatusCode(500, new { message = "Có lỗi xảy ra." });
        }
    }

    /// <summary>
    /// HOD review xong → gửi Giám đốc phê duyệt
    /// </summary>
    [HttpPost("{requestId}/submit-for-approval")]
    [Authorize(Roles = "Admin,Hod")]
    public async Task<IActionResult> SubmitForApproval(
        int requestId,
        [FromBody] RequestApproveScheduleDTO dto)
    {
        try
        {
            var request = await _requestRepo.GetByIdAsync(requestId);
            if (request == null)
                return NotFound(new { message = "Không tìm thấy yêu cầu." });

            if (request.Status != ScheduleStatusEnum.Ready)
                return BadRequest(new { message = "Lịch chưa sẵn sàng để gửi duyệt." });

            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            // Update status
            request.Status = ScheduleStatusEnum.PendingApproval;
            await _requestRepo.UpdateAsync(request);

            // Tạo approval record
            var approval = new ScheduleApproval
            {
                ScheduleRequestId = requestId,
                ApprovedBy = userId,
                Decision = "Submitted",
                Comment = dto.Comment,
                DecisionAt = DateTimeOffset.UtcNow,
                CreatedAt = DateTimeOffset.UtcNow
            };
            await _approvalRepo.AddAsync(approval);

            // Notify Giám đốc
            var deptName = request.Department?.Name ?? $"Khoa {request.DepartmentId}";
            await _notification.NotifyDirectorAsync(requestId, request.DepartmentId, deptName);

            return Ok(new { message = "Đã gửi Giám đốc phê duyệt." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error submitting for approval: RequestId={RequestId}", requestId);
            return StatusCode(500, new { message = "Có lỗi xảy ra." });
        }
    }

    /// <summary>
    /// Giám đốc phê duyệt lịch
    /// </summary>
    [HttpPost("{requestId}/approve")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Approve(int requestId, [FromBody] RequestApproveScheduleDTO dto)
    {
        try
        {
            var request = await _requestRepo.GetByIdAsync(requestId);
            if (request == null)
                return NotFound(new { message = "Không tìm thấy yêu cầu." });

            if (request.Status != ScheduleStatusEnum.PendingApproval)
                return BadRequest(new { message = "Yêu cầu không ở trạng thái chờ phê duyệt." });

            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            request.Status = ScheduleStatusEnum.Approved;
            await _requestRepo.UpdateAsync(request);

            var approval = new ScheduleApproval
            {
                ScheduleRequestId = requestId,
                ApprovedBy = userId,
                Decision = "Approved",
                Comment = dto.Comment,
                DecisionAt = DateTimeOffset.UtcNow,
                CreatedAt = DateTimeOffset.UtcNow
            };
            await _approvalRepo.AddAsync(approval);

            // Notify bác sĩ trong khoa
            await _notification.NotifyDoctorsApprovedAsync(request.DepartmentId, requestId);

            return Ok(new { message = "Đã phê duyệt lịch. Bác sĩ đã được thông báo." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error approving: RequestId={RequestId}", requestId);
            return StatusCode(500, new { message = "Có lỗi xảy ra." });
        }
    }

    /// <summary>
    /// Giám đốc từ chối lịch
    /// </summary>
    [HttpPost("{requestId}/reject")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Reject(int requestId, [FromBody] RequestApproveScheduleDTO dto)
    {
        try
        {
            var request = await _requestRepo.GetByIdAsync(requestId);
            if (request == null)
                return NotFound(new { message = "Không tìm thấy yêu cầu." });

            if (request.Status != ScheduleStatusEnum.PendingApproval)
                return BadRequest(new { message = "Yêu cầu không ở trạng thái chờ phê duyệt." });

            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            request.Status = ScheduleStatusEnum.Rejected;
            await _requestRepo.UpdateAsync(request);

            var approval = new ScheduleApproval
            {
                ScheduleRequestId = requestId,
                ApprovedBy = userId,
                Decision = "Rejected",
                Comment = dto.Comment,
                DecisionAt = DateTimeOffset.UtcNow,
                CreatedAt = DateTimeOffset.UtcNow
            };
            await _approvalRepo.AddAsync(approval);

            // Notify HOD
            await _notification.NotifyScheduleRejectedAsync(
                request.RequestedBy, requestId, dto.Comment ?? "Không đạt yêu cầu");

            return Ok(new { message = "Đã từ chối lịch. Trưởng khoa đã được thông báo." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error rejecting: RequestId={RequestId}", requestId);
            return StatusCode(500, new { message = "Có lỗi xảy ra." });
        }
    }
}
```

### 6.4 Đăng ký trong `Program.cs`

**File:** `WebApi/Program.cs` — thêm các dòng sau:

```csharp
// Import thêm
using WebApi.Hubs;
using WebApi.Services;

// THÊM: Đăng ký SignalR
builder.Services.AddSignalR(options =>
{
    options.KeepAliveInterval = TimeSpan.FromSeconds(15);
    options.ClientTimeoutInterval = TimeSpan.FromSeconds(30);
    options.EnableDetailedErrors = builder.Environment.IsDevelopment();
});

// THÊM: Đăng ký NotificationService
builder.Services.AddScoped<NotificationService>();

// THÊM: Đăng ký Repository cho Scheduling (nếu không đã đăng ký trong Infrastructure DI)
// builder.Services.AddScoped<IScheduleRequestRepository, ScheduleRequestRepository>();
// builder.Services.AddScoped<IScheduleApprovalRepository, ScheduleApprovalRepository>();

// ... sau app.MapControllers(); thì THÊM:

// THÊM: Map SignalR Hub
app.MapHub<SchedulingHub>("/hubs/scheduling");
```

Thêm CORS origin nếu cần (SignalR cần `AllowCredentials` — đã có trong config hiện tại).

---

## 7. Phase 5 — Database Migration

Chạy từ thư mục `server/`:

```bash
dotnet ef migrations add AddScheduleRequestsAndApprovals \
  --project Infrastructure \
  --startup-project WebApi

dotnet ef database update \
  --project Infrastructure \
  --startup-project WebApi
```

Migration sẽ tạo:
- Bảng `schedule_requests` với các cột: `Id`, `DepartmentId`, `RequestedBy`, `Status`, `HangfireJobId`, `ScheduleData`, `PeriodStart`, `PeriodEnd`, `CreatedAt`, `UpdatedAt`...
- Bảng `schedule_approvals` với các cột: `Id`, `ScheduleRequestId`, `ApprovedBy`, `Decision`, `Comment`, `DecisionAt`...
- Foreign keys đến `departments` và `user_accounts`/`employees`

---

## 8. Phase 6 — Client

### 8.1 Cài package

Chạy từ thư mục `client/`:

```bash
yarn add @microsoft/signalr
```

### 8.2 SignalR Hub Connection

**File:** `client/src/lib/signalr/scheduling-hub.ts` (tạo mới)

```typescript
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { getCookie } from "cookies-next";

let connection: HubConnection | null = null;

export function getSchedulingConnection(): HubConnection {
  if (connection) return connection;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5034";

  connection = new HubConnectionBuilder()
    .withUrl(`${apiUrl}/hubs/scheduling`, {
      accessTokenFactory: () => getCookie("token")?.toString() || "",
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000])
    .configureLogging(LogLevel.Information)
    .build();

  return connection;
}

export async function startSchedulingConnection(): Promise<HubConnection> {
  const conn = getSchedulingConnection();

  if (conn.state === "Disconnected") {
    await conn.start();
    console.log("SignalR connected");
  }

  return conn;
}

export async function joinDepartmentGroup(departmentId: number): Promise<void> {
  const conn = getSchedulingConnection();
  await conn.invoke("JoinDepartmentGroup", departmentId);
}

export async function joinDirectorGroup(): Promise<void> {
  const conn = getSchedulingConnection();
  await conn.invoke("JoinDirectorGroup");
}

export function stopSchedulingConnection(): void {
  if (connection) {
    connection.stop();
    connection = null;
  }
}
```

### 8.3 Scheduling Service

**File:** `client/src/services/scheduling.service.ts` (tạo mới)

```typescript
import { api } from "@/axios";

export interface GenerateSchedulePayload {
  departmentId: number;
  periodStart: string;
  periodEnd: string;
}

export interface ScheduleRequestResponse {
  id: number;
  departmentId: number;
  departmentName?: string;
  status: string;
  hangfireJobId?: string;
  scheduleData?: string;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
  updatedAt?: string;
}

export class SchedulingService {
  static async generate(payload: GenerateSchedulePayload) {
    const response = await api.post("/scheduling/generate", payload);
    return response.data;
  }

  static async getRequest(requestId: number) {
    const response = await api.get(`/scheduling/${requestId}`);
    return response.data as ScheduleRequestResponse;
  }

  static async getByDepartment(departmentId: number) {
    const response = await api.get(`/scheduling/department/${departmentId}`);
    return response.data as ScheduleRequestResponse[];
  }

  static async submitForApproval(requestId: number, comment?: string) {
    const response = await api.post(
      `/scheduling/${requestId}/submit-for-approval`,
      { comment }
    );
    return response.data;
  }

  static async approve(requestId: number, comment?: string) {
    const response = await api.post(`/scheduling/${requestId}/approve`, {
      comment,
    });
    return response.data;
  }

  static async reject(requestId: number, comment?: string) {
    const response = await api.post(`/scheduling/${requestId}/reject`, {
      comment,
    });
    return response.data;
  }
}
```

### 8.4 Tích hợp vào layout (ví dụ)

Trong layout/page của HOD, sử dụng:

```typescript
import { useEffect } from "react";
import {
  startSchedulingConnection,
  joinDepartmentGroup,
  stopSchedulingConnection,
} from "@/lib/signalr/scheduling-hub";

useEffect(() => {
  const setupSignalR = async () => {
    const conn = await startSchedulingConnection();

    conn.on("ScheduleReady", (data) => {
      console.log("Lịch đã xếp xong:", data);
      // hiện toast / popup cho HOD
    });

    conn.on("ScheduleFailed", (data) => {
      console.error("Xếp lịch thất bại:", data);
      // hiện toast lỗi
    });

    conn.on("ScheduleRejected", (data) => {
      console.log("Lịch bị từ chối:", data);
      // hiện toast
    });

    // Join department group
    if (currentDepartmentId) {
      await joinDepartmentGroup(currentDepartmentId);
    }
  };

  setupSignalR();

  return () => {
    stopSchedulingConnection();
  };
}, []);
```

Cho Giám đốc:

```typescript
import { joinDirectorGroup } from "@/lib/signalr/scheduling-hub";

conn.on("NewApprovalRequest", (data) => {
  console.log("Có lịch cần duyệt:", data);
  // cập nhật badge / notification
});
```

---

## 9. Phase 7 — Config & Final

### 9.1 `appsettings.json`

Thêm cấu hình Python service:

```json
{
  "PythonService": {
    "BaseUrl": "http://localhost:8000"
  }
}
```

### 9.2 Cập nhật NotificationTypeEnum

**File:** `Domain/Enums/NotificationTypeEnum.cs` — thêm:

```csharp
ScheduleReady,
ScheduleApproved,
ScheduleRejected,
ScheduleFailed,
ApprovalRequest
```

### 9.3 Cập nhật CORS nếu cần

Trong `Program.cs`, đảm bảo CORS cho phép SignalR WebSocket:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:3000",
                // ... các origin khác
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials(); // BẮT BUỘC cho SignalR
    });
});
```

---

## 10. Checklist tổng hợp

### Phase 1 — Fix Hangfire hiện tại

- [ ] Fix `HangfireAuthorizationFilter` — check Admin role
- [ ] Thêm `CompatibilityLevel.Version_180` vào `AddHangfire`
- [ ] Thêm `Queues` vào `AddHangfireServer`
- [ ] Đổi Dashboard Title

### Phase 2 — Domain Layer

- [ ] Tạo `ScheduleStatusEnum.cs`
- [ ] Tạo `ScheduleRequest.cs`
- [ ] Tạo `ScheduleApproval.cs`
- [ ] Thêm DbSet vào `AppDbContext`
- [ ] Thêm navigation properties vào `Department`, `Employee`

### Phase 3 — Application Layer

- [ ] Tạo `IScheduleRequestRepository.cs`
- [ ] Tạo `IScheduleApprovalRepository.cs`
- [ ] Tạo `IPythonSchedulingClient.cs`
- [ ] Tạo `RequestGenerateScheduleDTO.cs`
- [ ] Tạo `ResponseScheduleRequestDTO.cs`
- [ ] Tạo `RequestApproveScheduleDTO.cs`

### Phase 4 — Infrastructure Layer

- [ ] Tạo `ScheduleRequestRepository.cs`
- [ ] Tạo `ScheduleApprovalRepository.cs`
- [ ] Tạo `PythonSchedulingClient.cs`
- [ ] Tạo `SchedulingJob.cs`
- [ ] Đăng ký DI trong `DependencyInjection.cs`

### Phase 5 — WebApi Layer

- [ ] Tạo `SchedulingHub.cs`
- [ ] Tạo `NotificationService.cs`
- [ ] Tạo `SchedulingController.cs`
- [ ] Đăng ký SignalR + Hub trong `Program.cs`
- [ ] Đăng ký `NotificationService` trong `Program.cs`

### Phase 6 — Database

- [ ] Tạo migration `AddScheduleRequestsAndApprovals`
- [ ] Chạy migration

### Phase 7 — Client

- [ ] Cài `@microsoft/signalr`
- [ ] Tạo `scheduling-hub.ts`
- [ ] Tạo `scheduling.service.ts`
- [ ] Integrate SignalR vào HOD và Director pages

### Phase 8 — Config

- [ ] Thêm `PythonService:BaseUrl` vào `appsettings.json`
- [ ] Cập nhật `NotificationTypeEnum`
- [ ] Verify CORS `AllowCredentials`

### Phase 9 — Test

- [ ] Test Hangfire dashboard truy cập `/hangfire`
- [ ] Test enqueue job khi POST `/api/scheduling/generate`
- [ ] Test SignalR connection từ client
- [ ] Test flow đầy đủ: Generate → Ready → Submit → Approve

# 📋 Tài liệu Triển khai: Tính năng Xếp lịch Tự động

> **Công nghệ:** .NET · SignalR · Hangfire · Python Service  
> **Phiên bản:** 1.0 | **Phân loại:** Tài liệu kỹ thuật nội bộ

---

## Mục lục

1. [Tổng quan luồng nghiệp vụ](#1-tổng-quan-luồng-nghiệp-vụ)
2. [Lý thuyết cần nắm — Hangfire](#2-lý-thuyết-cần-nắm--hangfire)
3. [Lý thuyết cần nắm — SignalR](#3-lý-thuyết-cần-nắm--signalr)
4. [Kiến trúc hệ thống](#4-kiến-trúc-hệ-thống)
5. [Triển khai chi tiết](#5-triển-khai-chi-tiết)
6. [Các lưu ý & Best Practices](#6-các-lưu-ý--best-practices)
7. [Checklist triển khai](#7-checklist-triển-khai)

---

## 1. Tổng quan luồng nghiệp vụ

### 1.1 Actors & Roles

| Actor | Vai trò |
|---|---|
| **Trưởng khoa** | Khởi tạo xếp lịch, review & gửi lịch cho Giám đốc |
| **Giám đốc** | Phê duyệt hoặc từ chối lịch |
| **Bác sĩ** | Nhận thông báo lịch sau khi được phê duyệt |
| **.NET Server** | Orchestrate toàn bộ luồng |
| **Python Service** | Thực thi thuật toán xếp lịch (CPU-intensive) |

---

### 1.2 Luồng chuẩn hóa

```
┌─────────────────────────────────────────────────────────────────┐
│ GIAI ĐOẠN 1 — KHỞI TẠO XẾP LỊCH                                 │
└─────────────────────────────────────────────────────────────────┘

[Trưởng khoa] bấm "Xếp lịch tự động"
        │
        ▼
[.NET Server] nhận HTTP POST
        │  → Validate request
        │  → Tạo Hangfire Background Job
        │  → Lưu trạng thái: ScheduleStatus = PENDING
        │  → Trả về HTTP 202 Accepted ngay lập tức
        │
        ▼
[UI] hiển thị: "Đang xử lý, bạn có thể tiếp tục thao tác..."
[Trưởng khoa] tự do sử dụng các chức năng khác

        │ (Chạy ngầm — Hangfire)
        ▼
[Hangfire Job] gọi Python Scheduling Service
        │  → Truyền dữ liệu: danh sách bác sĩ, ca làm việc, ràng buộc...
        │  → Chờ Python xử lý thuật toán (có thể vài phút)
        │  → Nhận kết quả lịch từ Python
        │  → Lưu lịch vào DB
        │  → Cập nhật: ScheduleStatus = READY
        │
        ▼
[SignalR] push thông báo đến đúng Trưởng khoa
        → "✅ Lịch đã được xếp xong. Bấm để xem và xác nhận."


┌─────────────────────────────────────────────────────────────────┐
│ GIAI ĐOẠN 2 — PHÊ DUYỆT CẤP TRƯỞNG KHOA                         │
└─────────────────────────────────────────────────────────────────┘

[Trưởng khoa] xem lịch → bấm "Accept & Gửi Giám đốc"
        │
        ▼
[.NET Server]
        │  → Cập nhật: ScheduleStatus = PENDING_APPROVAL
        │  → Tạo approval record
        │
        ▼
[SignalR] push thông báo đến Giám đốc
        → "📋 Trưởng khoa [tên] vừa gửi lịch khoa [X] để phê duyệt."


┌─────────────────────────────────────────────────────────────────┐
│ GIAI ĐOẠN 3 — PHÊ DUYỆT CẤP GIÁM ĐỐC & THÔNG BÁO BÁC SĨ         │
└─────────────────────────────────────────────────────────────────┘

[Giám đốc] xem lịch → bấm "Phê duyệt"
        │
        ▼
[.NET Server]
        │  → Cập nhật: ScheduleStatus = APPROVED
        │  → Lấy danh sách bác sĩ thuộc khoa
        │
        ▼
[SignalR] push thông báo hàng loạt đến Group "dept_{departmentId}"
        → "🗓️ Lịch làm việc tháng [X] đã được phê duyệt. Xem ngay!"

[Bác sĩ] nhận thông báo trên app/web
```

---

### 1.3 Trạng thái lịch (State Machine)

```
NONE → PENDING → READY → PENDING_APPROVAL → APPROVED
                                          ↘ REJECTED → (quay lại READY để chỉnh sửa)
```

| Status | Ý nghĩa |
|---|---|
| `PENDING` | Hangfire job đang chạy, Python đang xử lý |
| `READY` | Lịch đã xếp xong, chờ Trưởng khoa xem xét |
| `PENDING_APPROVAL` | Đã gửi Giám đốc, chờ phê duyệt |
| `APPROVED` | Giám đốc đã duyệt, bác sĩ được notify |
| `REJECTED` | Giám đốc từ chối, Trưởng khoa cần chỉnh sửa |

---

## 2. Lý thuyết cần nắm — Hangfire

### 2.1 Hangfire là gì?

Hangfire là thư viện .NET cho phép thực thi các **tác vụ nền (background jobs)** một cách đáng tin cậy. Điểm mấu chốt: jobs được **lưu vào database** trước khi thực thi, nên kể cả server bị restart giữa chừng, job vẫn không bị mất.

```
Không có Hangfire:                    Có Hangfire:
HTTP Request → xử lý → Response      HTTP Request → lưu job vào DB → Response 202
     │                                     │
     └── nếu timeout hoặc crash           └── Hangfire worker đọc DB và xử lý
         → job mất hoàn toàn               → crash thì retry, không mất job
```

---

### 2.2 Các loại Job trong Hangfire

#### 🔹 Fire-and-Forget Job _(dùng cho bài toán này)_
Tạo một lần, chạy một lần càng sớm càng tốt.

```csharp
// Enqueue job ngay khi user bấm "Xếp lịch"
var jobId = BackgroundJob.Enqueue(
    () => _schedulingService.RunSchedulingAsync(departmentId, userId)
);
```

#### 🔹 Delayed Job
Chạy sau một khoảng thời gian nhất định.

```csharp
// Gửi reminder sau 1 ngày nếu Giám đốc chưa duyệt
BackgroundJob.Schedule(
    () => _notificationService.SendApprovalReminder(scheduleId),
    TimeSpan.FromDays(1)
);
```

#### 🔹 Recurring Job
Chạy theo lịch cố định (Cron expression). Hữu ích nếu sau này muốn tự động xếp lịch định kỳ.

```csharp
// Tự động xếp lịch vào 8h sáng thứ 2 đầu tháng
RecurringJob.AddOrUpdate(
    "auto-schedule",
    () => _schedulingService.AutoScheduleAll(),
    "0 8 1 * 1"  // Cron: 8:00 sáng, ngày 1, thứ 2
);
```

#### 🔹 Continuation Job
Job B chạy sau khi Job A hoàn thành.

```csharp
var jobId = BackgroundJob.Enqueue(() => _schedulingService.RunAsync(departmentId));
BackgroundJob.ContinueJobWith(jobId, () => _notificationService.NotifyReady(departmentId));
```

---

### 2.3 Kiến trúc bên trong Hangfire

```
┌─────────────────────────────────────────────────────┐
│                   .NET Application                  │
│                                                     │
│  BackgroundJob.Enqueue(...)                         │
│         │                                           │
│         ▼                                           │
│  ┌─────────────┐    Serialize    ┌───────────────┐  │
│  │  Hangfire   │ ─────────────→  │   Database    │  │
│  │   Client    │                 │  (SQL Server/ │  │
│  └─────────────┘                 │   Redis/...)  │  │
│                                  └───────────────┘  │
│  ┌─────────────┐    Dequeue     ┌───────────────┐   │
│  │  Hangfire   │ ←───────────── │   Job Queue   │   │
│  │   Server    │                └───────────────┘   │
│  │  (Worker)   │                                    │
│  └─────────────┘                                    │
│         │                                           │
│         ▼                                           │
│    Execute Job (gọi Python service...)              │
└─────────────────────────────────────────────────────┘
```

**3 thành phần chính:**

| Thành phần | Vai trò |
|---|---|
| **Client** | Phần code tạo job (`BackgroundJob.Enqueue(...)`) |
| **Storage** | Nơi lưu job (SQL Server, Redis, PostgreSQL...) |
| **Server** | Worker process đọc job từ storage và thực thi |

---

### 2.4 Retry Policy

Hangfire tự động retry khi job thất bại:

```csharp
// Mặc định: retry 10 lần với thời gian tăng dần (exponential backoff)
// Lần 1: sau 1 phút
// Lần 2: sau 5 phút
// Lần 3: sau 10 phút...

// Tùy chỉnh retry cho một job cụ thể
[AutomaticRetry(Attempts = 3, DelaysInSeconds = new[] { 30, 60, 120 })]
public async Task RunSchedulingAsync(int departmentId, string userId)
{
    // ...
}

// Tắt retry cho job này
[AutomaticRetry(Attempts = 0)]
public async Task SendNotificationAsync(string userId, string message) { }
```

---

### 2.5 Hangfire Dashboard

Hangfire cung cấp sẵn một Dashboard UI để theo dõi jobs:

```csharp
// Program.cs
app.UseHangfireDashboard("/hangfire", new DashboardOptions
{
    Authorization = new[] { new HangfireAuthorizationFilter() } // Chặn public access
});
```

Truy cập: `https://your-app.com/hangfire`

Dashboard hiển thị:
- Jobs đang chờ (Enqueued)
- Jobs đang chạy (Processing)
- Jobs thành công (Succeeded)
- Jobs thất bại và lý do (Failed)
- Lịch sử retry

---

### 2.6 Cài đặt & Cấu hình Hangfire

```bash
dotnet add package Hangfire
dotnet add package Hangfire.SqlServer      # nếu dùng SQL Server
dotnet add package Hangfire.AspNetCore
```

```csharp
// Program.cs
builder.Services.AddHangfire(config => config
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UseSqlServerStorage(builder.Configuration.GetConnectionString("HangfireDb"))
);

builder.Services.AddHangfireServer(options =>
{
    options.WorkerCount = 5;          // Số worker chạy song song
    options.Queues = new[] { "scheduling", "notifications", "default" };
});
```

---

## 3. Lý thuyết cần nắm — SignalR

### 3.1 SignalR là gì?

SignalR là thư viện .NET cho phép server **chủ động gửi dữ liệu xuống client** (server push) mà không cần client phải gửi request trước. Đây là nền tảng để xây dựng tính năng real-time.

```
Mô hình HTTP thông thường (Pull):        Mô hình SignalR (Push):
Client: "Xong chưa?"                     Server: "Xong rồi nè!"
Server: "Chưa."                              └→ Client nhận ngay
Client: "Xong chưa?"                         (không cần hỏi)
Server: "Chưa."
Client: "Xong chưa?"
Server: "Xong rồi."
```

---

### 3.2 Transport Protocols

SignalR tự động chọn transport tốt nhất dựa trên khả năng của client và server:

| Protocol | Mô tả | Khi nào dùng |
|---|---|---|
| **WebSocket** | Kết nối 2 chiều liên tục, hiệu quả nhất | Ưu tiên hàng đầu |
| **Server-Sent Events** | Server push 1 chiều qua HTTP | Khi WebSocket không available |
| **Long Polling** | Client liên tục poll, server giữ kết nối | Fallback cuối cùng |

> **Thực tế:** Hầu hết browser hiện đại đều hỗ trợ WebSocket. SignalR tự negotiate và chọn WebSocket. Dev không cần quan tâm nhiều.

---

### 3.3 Hub — Trái tim của SignalR

**Hub** là class trung tâm xử lý kết nối và giao tiếp giữa server và clients.

```csharp
// Server định nghĩa Hub
public class SchedulingHub : Hub
{
    // Client gọi lên server
    public async Task JoinDepartmentGroup(int departmentId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"dept_{departmentId}");
    }

    // Override lifecycle events
    public override async Task OnConnectedAsync()
    {
        // Khi client kết nối thành công
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        // Khi client mất kết nối
        await base.OnDisconnectedAsync(exception);
    }
}
```

---

### 3.4 Các cách gửi message từ Server

```csharp
// Inject IHubContext để gửi message từ bên ngoài Hub (trong Service, Controller...)
public class NotificationService
{
    private readonly IHubContext<SchedulingHub> _hub;

    public NotificationService(IHubContext<SchedulingHub> hub) => _hub = hub;

    // ① Gửi đến TẤT CẢ clients đang kết nối
    await _hub.Clients.All.SendAsync("ReceiveNotification", message);

    // ② Gửi đến MỘT user cụ thể (theo UserId từ JWT/Auth)
    await _hub.Clients.User(userId).SendAsync("ScheduleReady", scheduleId);

    // ③ Gửi đến một GROUP (ví dụ: tất cả bác sĩ trong khoa)
    await _hub.Clients.Group($"dept_{departmentId}").SendAsync("ScheduleApproved", data);

    // ④ Gửi đến một ConnectionId cụ thể
    await _hub.Clients.Client(connectionId).SendAsync("PersonalMessage", data);

    // ⑤ Gửi đến nhiều users cụ thể
    await _hub.Clients.Users(new[] { userId1, userId2 }).SendAsync("BulkNotify", data);
}
```

---

### 3.5 Groups — Quản lý nhóm kết nối

Groups cho phép gom nhóm nhiều client để broadcast dễ dàng:

```
Group "dept_101" (Khoa Nội):
  ├── ConnectionId: abc123 (BS. Nguyễn Văn A)
  ├── ConnectionId: def456 (BS. Trần Thị B)
  └── ConnectionId: ghi789 (BS. Lê Văn C)

Group "dept_102" (Khoa Ngoại):
  ├── ConnectionId: jkl012 (BS. Phạm Thị D)
  └── ConnectionId: mno345 (BS. Hoàng Văn E)
```

```csharp
// Thêm vào group khi client kết nối và chọn khoa
public async Task JoinDepartment(int departmentId)
{
    // Rời khoa cũ trước (nếu có)
    await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"dept_{previousDeptId}");
    // Vào khoa mới
    await Groups.AddToGroupAsync(Context.ConnectionId, $"dept_{departmentId}");
}
```

> **Lưu ý quan trọng:** Group membership **không được lưu persistent**. Khi user reconnect (F5, mất mạng), client cần join lại group.

---

### 3.6 Connection Lifecycle

```
Browser mở app
      │
      ▼
SignalR negotiate transport (WebSocket/SSE/Long Polling)
      │
      ▼
Kết nối thành công → OnConnectedAsync() gọi
ConnectionId được cấp (ví dụ: "abc123xyz")
      │
      ▼
Client join Group, nhận & gửi messages
      │
      ▼ (user đóng tab, mất mạng, hoặc idle quá lâu)
OnDisconnectedAsync() gọi
ConnectionId bị hủy
      │
      ▼ (nếu reconnect)
ConnectionId MỚI được cấp → phải join lại Group
```

---

### 3.7 Authentication với SignalR

SignalR tích hợp sẵn với ASP.NET Identity/JWT:

```csharp
// Client JavaScript — gửi JWT token khi kết nối
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/scheduling", {
        accessTokenFactory: () => localStorage.getItem("jwt_token")
    })
    .withAutomaticReconnect()  // Tự reconnect khi mất mạng
    .build();
```

```csharp
// Server — Hub tự nhận UserId từ JWT claims
public class SchedulingHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        var userId = Context.UserIdentifier; // Lấy từ JWT sub claim
        var role = Context.User?.FindFirst(ClaimTypes.Role)?.Value;
        // ...
    }
}
```

---

### 3.8 Cài đặt & Cấu hình SignalR

```bash
dotnet add package Microsoft.AspNetCore.SignalR
```

```csharp
// Program.cs — Server
builder.Services.AddSignalR(options =>
{
    options.KeepAliveInterval = TimeSpan.FromSeconds(15);
    options.ClientTimeoutInterval = TimeSpan.FromSeconds(30);
    options.EnableDetailedErrors = builder.Environment.IsDevelopment();
});

app.MapHub<SchedulingHub>("/hubs/scheduling");
```

```bash
# Client JavaScript
npm install @microsoft/signalr
```

---

## 4. Kiến trúc hệ thống

### 4.1 Sơ đồ kiến trúc tổng thể

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER / APP                           │
│                                                                 │
│   HTTP Request ──────────────────┐                              │
│   SignalR WebSocket ─────────────┼──────────────────────────┐   │
└──────────────────────────────────┼──────────────────────────┼───┘
                                   │                          │
┌──────────────────────────────────▼──────────────────────────▼───┐
│                        .NET API SERVER                          │
│                                                                 │
│  ┌────────────────┐    ┌─────────────────┐    ┌─────────────┐  │
│  │  Controllers   │    │  SignalR Hub    │    │  Services   │  │
│  │  (HTTP API)    │    │  /hubs/sched..  │    │  (Business) │  │
│  └───────┬────────┘    └────────┬────────┘    └──────┬──────┘  │
│          │                      │                     │         │
│          │             ┌────────▼────────┐            │         │
│          └────────────►│ Hangfire Client │◄───────────┘         │
│                        └────────┬────────┘                      │
└─────────────────────────────────┼───────────────────────────────┘
                                  │
              ┌───────────────────▼──────────────────┐
              │          SQL Server Database          │
              │  - Business data (schedules, users)   │
              │  - Hangfire job storage               │
              └───────────────────┬──────────────────┘
                                  │
              ┌───────────────────▼──────────────────┐
              │       Hangfire Background Server      │
              │  (Worker process đọc job từ DB)       │
              └───────────────────┬──────────────────┘
                                  │ HTTP call
              ┌───────────────────▼──────────────────┐
              │         Python Scheduling Service     │
              │  (Thuật toán xếp lịch, trả JSON)      │
              └──────────────────────────────────────┘
```

---

### 4.2 Database Schema (tham khảo)

```sql
-- Bảng lưu trạng thái xếp lịch
CREATE TABLE ScheduleRequests (
    Id              INT PRIMARY KEY IDENTITY,
    DepartmentId    INT NOT NULL,
    RequestedBy     NVARCHAR(450) NOT NULL,  -- UserId của Trưởng khoa
    Status          NVARCHAR(50) NOT NULL,   -- PENDING/READY/PENDING_APPROVAL/APPROVED/REJECTED
    HangfireJobId   NVARCHAR(100),           -- Lưu để track job
    ScheduleData    NVARCHAR(MAX),           -- JSON kết quả từ Python
    CreatedAt       DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt       DATETIME2
);

-- Bảng approval
CREATE TABLE ScheduleApprovals (
    Id              INT PRIMARY KEY IDENTITY,
    ScheduleRequestId INT NOT NULL REFERENCES ScheduleRequests(Id),
    ApprovedBy      NVARCHAR(450),           -- UserId của Giám đốc
    Decision        NVARCHAR(20),            -- APPROVED / REJECTED
    Comment         NVARCHAR(500),
    DecisionAt      DATETIME2
);
```

---

## 5. Triển khai chi tiết

### 5.1 Cấu trúc Project

```
Solution/
├── API/                          # ASP.NET Core Web API
│   ├── Controllers/
│   │   └── SchedulingController.cs
│   ├── Hubs/
│   │   └── SchedulingHub.cs
│   ├── Services/
│   │   ├── SchedulingService.cs      # Gọi Python, lưu kết quả
│   │   └── NotificationService.cs   # Wrap SignalR push
│   └── Program.cs
│
├── Infrastructure/
│   ├── HangfireJobs/
│   │   └── SchedulingJob.cs
│   └── PythonClient/
│       └── PythonSchedulingClient.cs # HttpClient gọi Python
│
└── Domain/
    ├── Entities/
    │   ├── ScheduleRequest.cs
    │   └── ScheduleApproval.cs
    └── Enums/
        └── ScheduleStatus.cs
```

---

### 5.2 Controller — Nhận request xếp lịch

```csharp
[ApiController]
[Route("api/scheduling")]
[Authorize(Roles = "DepartmentHead")]
public class SchedulingController : ControllerBase
{
    private readonly IBackgroundJobClient _jobs;
    private readonly IScheduleRequestRepository _repo;

    [HttpPost("generate")]
    public async Task<IActionResult> GenerateSchedule([FromBody] GenerateScheduleDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        // 1. Tạo record lưu trạng thái
        var request = new ScheduleRequest
        {
            DepartmentId = dto.DepartmentId,
            RequestedBy  = userId,
            Status       = ScheduleStatus.Pending,
            CreatedAt    = DateTime.UtcNow
        };
        await _repo.AddAsync(request);

        // 2. Enqueue Hangfire job — không block, trả về ngay
        var jobId = _jobs.Enqueue<SchedulingJob>(
            job => job.ExecuteAsync(request.Id, userId)
        );

        // 3. Lưu jobId để track
        request.HangfireJobId = jobId;
        await _repo.UpdateAsync(request);

        // 4. Trả về 202 Accepted (không phải 200 OK)
        return Accepted(new { requestId = request.Id, jobId });
    }

    [HttpPost("{requestId}/approve-and-submit")]
    public async Task<IActionResult> ApproveAndSubmit(int requestId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var request = await _repo.GetByIdAsync(requestId);

        if (request.Status != ScheduleStatus.Ready)
            return BadRequest("Lịch chưa sẵn sàng để gửi.");

        request.Status = ScheduleStatus.PendingApproval;
        await _repo.UpdateAsync(request);

        // Push SignalR đến Giám đốc
        await _notificationService.NotifyDirectorAsync(request);

        return Ok();
    }
}
```

---

### 5.3 Hangfire Job — Xử lý xếp lịch

```csharp
public class SchedulingJob
{
    private readonly IPythonSchedulingClient _pythonClient;
    private readonly IScheduleRequestRepository _repo;
    private readonly NotificationService _notification;

    [AutomaticRetry(Attempts = 3, DelaysInSeconds = new[] { 60, 120, 300 })]
    public async Task ExecuteAsync(int requestId, string userId)
    {
        var request = await _repo.GetByIdAsync(requestId);

        try
        {
            // 1. Gọi Python service (có thể mất vài phút)
            var scheduleData = await _pythonClient.GenerateScheduleAsync(new
            {
                departmentId = request.DepartmentId,
                period       = request.Period,
                constraints  = request.Constraints
            });

            // 2. Lưu kết quả
            request.Status       = ScheduleStatus.Ready;
            request.ScheduleData = JsonSerializer.Serialize(scheduleData);
            request.UpdatedAt    = DateTime.UtcNow;
            await _repo.UpdateAsync(request);

            // 3. Notify Trưởng khoa qua SignalR
            await _notification.NotifyScheduleReadyAsync(userId, requestId);
        }
        catch (Exception ex)
        {
            request.Status = ScheduleStatus.Failed;
            await _repo.UpdateAsync(request);

            // Notify lỗi cho Trưởng khoa
            await _notification.NotifyScheduleFailedAsync(userId, ex.Message);

            throw; // Re-throw để Hangfire retry
        }
    }
}
```

---

### 5.4 SignalR Hub

```csharp
[Authorize]
public class SchedulingHub : Hub
{
    private readonly ILogger<SchedulingHub> _logger;

    // Client gọi lên để join group của khoa mình
    public async Task JoinDepartmentGroup(int departmentId)
    {
        var role = Context.User?.FindFirstValue(ClaimTypes.Role);

        // Bác sĩ join group để nhận notify lịch của khoa
        if (role == "Doctor")
        {
            await Groups.AddToGroupAsync(
                Context.ConnectionId,
                $"dept_{departmentId}"
            );
            _logger.LogInformation("User {UserId} joined dept_{DeptId}", 
                Context.UserIdentifier, departmentId);
        }
    }

    // Giám đốc join group riêng
    public async Task JoinDirectorGroup()
    {
        var role = Context.User?.FindFirstValue(ClaimTypes.Role);
        if (role == "Director")
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "directors");
        }
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        _logger.LogInformation("User {UserId} disconnected", Context.UserIdentifier);
        await base.OnDisconnectedAsync(exception);
    }
}
```

---

### 5.5 Notification Service — Tập trung logic push

```csharp
public class NotificationService
{
    private readonly IHubContext<SchedulingHub> _hub;

    // Giai đoạn 1: Lịch xếp xong → notify Trưởng khoa
    public async Task NotifyScheduleReadyAsync(string userId, int requestId)
    {
        await _hub.Clients.User(userId).SendAsync("ScheduleReady", new
        {
            requestId,
            message   = "Lịch đã được xếp xong. Bấm để xem và xác nhận.",
            timestamp = DateTime.UtcNow
        });
    }

    // Giai đoạn 2: Trưởng khoa gửi duyệt → notify Giám đốc
    public async Task NotifyDirectorAsync(ScheduleRequest request)
    {
        await _hub.Clients.Group("directors").SendAsync("NewApprovalRequest", new
        {
            requestId    = request.Id,
            departmentId = request.DepartmentId,
            submittedBy  = request.RequestedBy,
            message      = $"Lịch khoa {request.DepartmentId} cần phê duyệt.",
            timestamp    = DateTime.UtcNow
        });
    }

    // Giai đoạn 3: Giám đốc duyệt → notify tất cả bác sĩ trong khoa
    public async Task NotifyDoctorsApprovedAsync(int departmentId, int scheduleId)
    {
        await _hub.Clients.Group($"dept_{departmentId}").SendAsync("ScheduleApproved", new
        {
            scheduleId,
            departmentId,
            message   = "Lịch làm việc đã được phê duyệt. Xem ngay!",
            timestamp = DateTime.UtcNow
        });
    }

    // Xếp lịch thất bại
    public async Task NotifyScheduleFailedAsync(string userId, string reason)
    {
        await _hub.Clients.User(userId).SendAsync("ScheduleFailed", new
        {
            reason,
            message   = "Xếp lịch thất bại. Vui lòng thử lại.",
            timestamp = DateTime.UtcNow
        });
    }
}
```

---

### 5.6 Client JavaScript

```javascript
// schedulingSignalR.js
import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/scheduling", {
        accessTokenFactory: () => getJwtToken() // Hàm lấy JWT từ storage
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000]) // Retry sau 0s, 2s, 5s, 10s
    .configureLogging(signalR.LogLevel.Information)
    .build();

// ── Lắng nghe events từ server ────────────────────────────────────
connection.on("ScheduleReady", (data) => {
    showNotification("✅ " + data.message, "success");
    // Hiện badge/popup với link đến trang review lịch
    redirectToReview(data.requestId);
});

connection.on("NewApprovalRequest", (data) => {
    showNotification("📋 " + data.message, "info");
    updateApprovalBadge(); // Cập nhật số badge trên menu
});

connection.on("ScheduleApproved", (data) => {
    showNotification("🗓️ " + data.message, "success");
    refreshScheduleView(data.scheduleId);
});

connection.on("ScheduleFailed", (data) => {
    showNotification("❌ " + data.message, "error");
});

// ── Lifecycle ──────────────────────────────────────────────────────
connection.onreconnecting(() => {
    console.log("Đang kết nối lại...");
    showConnectionStatus("reconnecting");
});

connection.onreconnected(async () => {
    console.log("Đã kết nối lại.");
    showConnectionStatus("connected");
    // QUAN TRỌNG: Phải join lại group sau khi reconnect
    await joinDepartmentGroup(currentDepartmentId);
});

connection.onclose(() => {
    showConnectionStatus("disconnected");
});

// ── Start ──────────────────────────────────────────────────────────
async function startConnection() {
    try {
        await connection.start();
        await connection.invoke("JoinDepartmentGroup", currentDepartmentId);
        showConnectionStatus("connected");
    } catch (err) {
        console.error("Lỗi kết nối SignalR:", err);
        setTimeout(startConnection, 5000); // Retry sau 5s
    }
}

startConnection();
```

---

## 6. Các lưu ý & Best Practices

### 6.1 Hangfire

**✅ Nên làm:**

- Luôn **lưu trạng thái job vào database** của bạn trước, không chỉ dựa vào Hangfire storage để query trạng thái
- Đặt `AutomaticRetry` phù hợp cho từng loại job (job critical thì retry nhiều, job notify thì ít)
- Dùng **queue riêng** để ưu tiên job: `"critical"` > `"scheduling"` > `"notifications"` > `"default"`
- Log đầy đủ để debug khi job fail
- **Bảo mật Hangfire Dashboard** — không để public

**❌ Tránh:**

- Đừng để job chứa **state lớn** trong tham số (chỉ truyền Id, không truyền object phức tạp)
- Đừng để job **phụ thuộc vào HTTP context** (HttpContext không available trong background)
- Đừng enqueue quá nhiều job đồng thời nếu Python service có limit concurrency

```csharp
// ❌ SAI — Truyền object lớn
BackgroundJob.Enqueue(() => Process(entireScheduleObject));

// ✅ ĐÚNG — Chỉ truyền Id, job tự load từ DB
BackgroundJob.Enqueue(() => Process(scheduleRequestId));
```

---

### 6.2 SignalR

**✅ Nên làm:**

- Xử lý **reconnect** ở client và **join lại group** sau khi reconnect
- Dùng **Groups** thay vì loop qua từng user để gửi broadcast
- Với hệ thống nhiều server (load balancer), cần dùng **SignalR Backplane** (Redis, Azure SignalR Service)
- Validate authorization trong Hub methods trước khi thực hiện hành động

**❌ Tránh:**

- Đừng lưu **business logic** trong Hub, Hub chỉ nên xử lý kết nối và routing
- Đừng giả sử `ConnectionId` không đổi — nó thay đổi mỗi lần reconnect
- Đừng dùng SignalR để truyền **file lớn** — chỉ dùng cho messages nhỏ

```csharp
// ❌ SAI — Business logic trong Hub
public class SchedulingHub : Hub
{
    public async Task ApproveSchedule(int scheduleId)
    {
        // Đừng để approval logic ở đây!
        var schedule = await _db.Schedules.FindAsync(scheduleId);
        schedule.Status = "APPROVED";
        await _db.SaveChangesAsync();
        await Clients.All.SendAsync("Approved", scheduleId);
    }
}

// ✅ ĐÚNG — Hub chỉ routing, logic ở Controller/Service
// ApproveController.cs → xử lý logic → gọi NotificationService → push SignalR
```

---

### 6.3 Tích hợp Hangfire + SignalR

Khi Hangfire job hoàn thành và cần push SignalR, cần inject `IHubContext` (không inject Hub trực tiếp):

```csharp
// ✅ ĐÚNG — Inject IHubContext vào Service
public class SchedulingJob
{
    private readonly IHubContext<SchedulingHub> _hubContext; // OK
    
    // ❌ SAI — Không thể inject Hub instance
    // private readonly SchedulingHub _hub; // KHÔNG LÀM VẬY
}
```

---

### 6.4 Scale-out (nhiều server)

Khi deploy nhiều instance .NET server (load balancer):

```
Request 1 → Server A (ConnectionId abc123 ở đây)
Request 2 → Server B (ConnectionId def456 ở đây)

Server A muốn push đến ConnectionId def456 → KHÔNG BIẾT về kết nối ở Server B!
```

**Giải pháp — SignalR Backplane với Redis:**

```csharp
// Cài package
// dotnet add package Microsoft.AspNetCore.SignalR.StackExchangeRedis

builder.Services.AddSignalR()
    .AddStackExchangeRedis("localhost:6379", options =>
    {
        options.Configuration.ChannelPrefix = "SchedulingApp";
    });
```

Với Redis Backplane, tất cả servers chia sẻ thông tin connections và có thể push đến bất kỳ client nào.

---

## 7. Checklist triển khai

### Phase 1 — Setup cơ bản

- [ ] Cài đặt Hangfire packages, cấu hình SQL Server storage
- [ ] Tạo migration cho Hangfire tables
- [ ] Cài đặt SignalR, định nghĩa `SchedulingHub`
- [ ] Map hub endpoint `/hubs/scheduling`
- [ ] Cài SignalR client package ở Frontend
- [ ] Test kết nối WebSocket cơ bản

### Phase 2 — Core Feature

- [ ] Tạo `ScheduleRequests` table và entity
- [ ] Implement `SchedulingController.GenerateSchedule()` — enqueue job, trả 202
- [ ] Implement `SchedulingJob.ExecuteAsync()` — gọi Python, lưu kết quả
- [ ] Implement `NotificationService` — wrap các SignalR push method
- [ ] Client JS: lắng nghe `ScheduleReady`, hiện popup thông báo

### Phase 3 — Approval Flow

- [ ] Implement `ApproveAndSubmit` — update status, push notify Giám đốc
- [ ] Giám đốc Hub: join `"directors"` group khi login
- [ ] Implement Director Approve endpoint — update status, push notify bác sĩ
- [ ] Bác sĩ Hub: join `dept_{departmentId}` group khi login
- [ ] Client JS: lắng nghe `ScheduleApproved`, refresh lịch

### Phase 4 — Production Ready

- [ ] Bảo mật Hangfire Dashboard (chỉ Admin)
- [ ] Cấu hình retry policy cho từng loại job
- [ ] Setup queue priority (`scheduling` > `notifications`)
- [ ] Xử lý reconnect ở client, join lại group sau reconnect
- [ ] Test trường hợp Python service timeout/down
- [ ] (Nếu multi-server) Cấu hình Redis Backplane cho SignalR
- [ ] Logging & monitoring cho background jobs
- [ ] Load test: nhiều Trưởng khoa xếp lịch đồng thời

---

## Tóm tắt

| | Hangfire | SignalR |
|---|---|---|
| **Vai trò** | Xử lý tác vụ nặng bất đồng bộ | Thông báo real-time |
| **Lưu trữ** | SQL Server / Redis | In-memory (cần Backplane nếu multi-server) |
| **Khi nào dùng** | Gọi Python, xử lý lâu (phút) | Push kết quả ngay khi có |
| **Key concept** | Job Queue, Retry, Persistence | Hub, Groups, Server Push |

> **Nguyên tắc cốt lõi:** Hangfire đảm bảo tác vụ **chắc chắn được thực thi**. SignalR đảm bảo người dùng **nhận kết quả ngay lập tức**. Hai thư viện bổ trợ nhau hoàn hảo cho bài toán này.

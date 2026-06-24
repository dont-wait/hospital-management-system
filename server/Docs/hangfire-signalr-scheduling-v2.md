# Xếp lịch Ca Trực Tự động — Tài liệu Triển khai

> **Mục đích:** HOD bấm 1 nút → hệ thống tự xếp lịch → bác sĩ nhận thông báo có lịch mới.

---

## 1. Luồng hoạt động (Flow)

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   TRƯỞNG KHOA   │     │   .NET SERVER   │     │  SERVERLESS    │     │     DATABASE   │
│                 │     │                 │     │   (NSGA2IS)    │     │                 │
│ Bấm "Xếp lịch"  │────►│  1. Nhận request │────►│  2. Chạy thuật  │────►│  3. Lưu kết quả │
│                 │     │  2. Enqueue job │     │     toán        │     │  4. Tạo TaskItem│
│                 │     │  3. Trả 202 ngay│     │                 │     │                 │
│                 │     │                 │     │                 │     │                 │
│                 │◄────│                 │◄────│  Progress: 30%  │     │                 │
│ Nhận thông báo  │     │                 │     │  Progress: 60% │     │                 │
│ "Hoàn tất"      │     │                 │     │  Progress: 100%│     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │    SIGNALR     │
                       │  Push realtime  │
                       ├─────────────────┤
                       │ HOD: "Xong rồi"│
                       │ BS: "Có lịch mới"│
                       └─────────────────┘
```

---

## 2. Chi tiết từng bước

### Bước 1: HOD bấm nút "Xếp lịch tự động"

```http
POST /api/schedules/auto
Body: {
  "start_date": "2026-04-01",
  "num_days": 30,
  "max_weekly_hours_per_doctor": 48,
  "required_doctors_per_shift": 5,
  "shifts_per_day": 2,
  "doctors": [ ... ]
}
```

**Controller làm gì:**
1. Tạo `ScheduleRequest` record trong DB (status = "queued")
2. Enqueue Hangfire job
3. Trả HTTP 202 ngay lập tức (không chờ xử lý)

---

### Bước 2: Hangfire Job chạy ngầm

**Job gọi Serverless:**

```http
POST /api/v1/schedules/generate
→ Nhận response: { "request_id": "req_abc123", "status": "queued" }
```

**Poll progress mỗi 3 giây:**

```http
GET /api/v1/schedules/progress/req_abc123
→ Response: { "status": "running", "progress_percent": 45.0, ... }
```

**Mỗi lần poll:**
- Update `ScheduleRequest.ProgressPercent` vào DB
- Push SignalR cho HOD: "Tiến độ: 45%"

---

### Bước 3: Serverless hoàn thành

```json
{
  "status": "completed",
  "result": {
    "selected_schedule": {
      "assignments": [
        { "date": "2026-04-01", "shift": "shift_1", "doctor_ids": ["DOC001", "DOC002"] },
        { "date": "2026-04-01", "shift": "shift_2", "doctor_ids": ["DOC003"] }
      ]
    }
  }
}
```

**Job làm gì:**
1. Parse kết quả
2. Tạo `TaskItem` cho mỗi ca trực (dùng `ITaskItemService.CreateTaskItemAsync`)
3. Update `ScheduleRequest.status = "completed"`
4. Push SignalR: "Hoàn tất" cho HOD và bác sĩ

---

## 3. Cấu trúc Database

### Bảng `schedule_requests`

| Column | Type | Description |
|---|---|---|
| `Id` | long | PK |
| `DepartmentId` | int | Khoa nào |
| `RequestedBy` | Guid | Ai bấm nút |
| `Status` | string | queued → running → completed / failed |
| `ServerlessRequestId` | string | ID từ serverless (req_abc123) |
| `ProgressPercent` | int | 0-100 |
| `RequestPayload` | string | JSON gốc gửi cho serverless |
| `ResultData` | string | JSON kết quả trả về |
| `ErrorMessage` | string | Lỗi nếu có |
| `StartDate`, `NumDays` | date, int | Thông số |

---

## 4. SignalR Notifications

| Event | Ai nhận | Khi nào |
|---|---|---|
| Progress update | HOD | Mỗi lần poll (30%, 50%, ...) |
| Completed | HOD | Khi serverless xong |
| Completed | Bác sĩ trong khoa | Khi serverless xong |
| Failed | HOD | Khi có lỗi |

**Client listen:**
```javascript
connection.on("ReceiveNotification", (userId, message) => {
  const data = JSON.parse(message);
  if (data.Title === "Đang xếp lịch...") {
    // Progress update
    updateProgressBar(data.Data.progressPercent);
  } else if (data.Title === "Xếp lịch hoàn tất") {
    // Xong
    showSuccess("Lịch đã xếp xong!");
  }
});
```

---

## 5. Các file đã tạo/sửa

| # | File | Action | Mô tả |
|---|---|---|---|
| 1 | `Domain/Entities/ScheduleTask/ScheduleRequest.cs` | Tạo | Entity lưu trạng thái |
| 2 | `Application/.../IScheduleRequestRepository.cs` | Tạo | Interface CRUD |
| 3 | `Infrastructure/.../ScheduleRequestRepository.cs` | Tạo | Implementation |
| 4 | `Infrastructure/HangfireJobs/ServerlessResponse.cs` | Tạo | Map API serverless |
| 5 | `Infrastructure/HangfireJobs/AutoSchedulingHangfireJob.cs` | Tạo | Job chính |
| 6 | `Infrastructure/Services/SignalR/SignalRService.cs` | Sửa | Thêm method SendToDepartment |
| 7 | `Infrastructure/DependencyInjection.cs` | Sửa | Đăng ký DI |
| 8 | `Infrastructure/Persistence/AppDbContext.cs` | Sửa | Thêm DbSet |
| 9 | `WebApi/Controllers/Schedule/ScheduleController.cs` | Sửa | Thêm endpoint POST auto |
| 10 | `WebApi/Program.cs` | Sửa | Map SchedulingHub |
| 11 | `WebApi/appsettings.json` | Sửa | Thêm ServerlessService:BaseUrl |

---

## 6. Cấu hình

### appsettings.json
```json
{
  "ServerlessService": {
    "BaseUrl": "https://nsga2is-sls.azurewebsites.net"
  }
}
```

### Hangfire Dashboard
- URL: `/hangfire`
- Queue: `scheduling` (ưu tiên cao)

---

## 7. Test

```bash
# 1. Gọi API
POST /api/schedules/auto
Body: { "start_date": "2026-04-01", "num_days": 7, ... }

# Response: 202 Accepted
{ "requestId": 1, "jobId": "..." }

# 2. Kiểm tra progress
GET /api/schedules/auto/1
# Response: { "status": "running", "progressPercent": 45 }

# 3. Kiểm tra SignalR (console log)
# Sẽ thấy: "Tiến độ: 45%", "Tiến độ: 70%", "Hoàn tất"

# 4. Kiểm tra DB
# Bảng schedule_requests: status = "completed"
# Bảng tasks: có các TaskItem mới
# Bảng task_registrations: có các bác sĩ được assign
```

---

## 8. FAQ

**Q: Tại sao không gọi serverless trực tiếp từ controller?**
A: Vì thuật toán có thể mất vài phút, HTTP sẽ timeout. Dùng Hangfire để chạy ngầm, client nhận 202 ngay.

**Q: Progress update có bắt buộc không?**
A: Không. Nếu không cần, có thể bỏ polling loop, chỉ gọi generate rồi chờ completed. Nhưng có thì UX tốt hơn.

**Q: Nếu serverless fail thì sao?**
A: Job catch exception → update status = "failed" → push SignalR báo lỗi cho HOD → Hangfire retry (3 lần).

**Q: Cần migration không?**
A: Cần. Chạy: `dotnet ef migrations add AddScheduleRequestFields`

using System.Text.Json;
using Domain.Entities.ScheduleTask;
using Domain.Enums;
using Hangfire;
using Infrastructure.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Application.Common.Interface.Scheduling;

namespace Infrastructure.Services.Hangfire;

public class AutoSchedulingHangfireJob
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IBackgroundJobClient _backgroundJobClient;
    private readonly ILogger<AutoSchedulingHangfireJob> _logger;
    private const int PollIntervalSeconds = 3;
    private const int MaxPollAttempts = 200;
    private const int ResumePollingDelaySeconds = 30;

    public AutoSchedulingHangfireJob(
        IServiceScopeFactory scopeFactory,
        IEmployeeRepository employeeRepository,
        IBackgroundJobClient backgroundJobClient,
        ILogger<AutoSchedulingHangfireJob> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
        _employeeRepository = employeeRepository;
        _backgroundJobClient = backgroundJobClient;
    }

    [AutomaticRetry(Attempts = 2, DelaysInSeconds = new[] { 30, 120 })]
    [Queue("scheduling")]
    public async Task ExecuteAsync(long scheduleRequestId)
    {
        _logger.LogInformation("AutoSchedulingJob START — RequestId={Id}", scheduleRequestId);

        using var scope = _scopeFactory.CreateScope();
        var requestRepo = scope.ServiceProvider.GetRequiredService<IScheduleRequestRepository>();
        var serverless = scope.ServiceProvider.GetRequiredService<ScheduleServerlessService>();
        var taskItemService = scope.ServiceProvider.GetRequiredService<ITaskItemService>();
        var roomRepo = scope.ServiceProvider.GetRequiredService<IRoomRepository>();
        var signalRService = scope.ServiceProvider.GetRequiredService<SignalRService>();

        var request = await requestRepo.GetByIdAsync(scheduleRequestId);
        if (request == null)
        {
            _logger.LogError("ScheduleRequest {Id} not found", scheduleRequestId);
            return;
        }

        try
        {
            string serverlessRequestId;
            if (string.IsNullOrWhiteSpace(request.ServerlessRequestId))
            {
                // Bước 1: Gọi POST /run cho request mới
                request.Status = ScheduleEnum.QUEUED.ToString();
                await requestRepo.UpdateAsync(request);

                _logger.LogInformation("Calling serverless /run...");

                var schedulingPayload = JsonSerializer.Deserialize<RequestSchedulingDTO>(request.RequestPayload!);
                _logger.LogInformation("Initial Payload IDs: {Ids}",
                    string.Join(", ", schedulingPayload?.Doctors.Select(d => d.Id) ?? new List<string>()));
                var runResult = await serverless.RunAsync(schedulingPayload!);

                serverlessRequestId = runResult.GetProperty("request_id").GetString()
                    ?? throw new Exception("Serverless did not return request_id");

                request.ServerlessRequestId = serverlessRequestId;
                request.Status = runResult.GetProperty("status").GetString() ?? ScheduleEnum.QUEUED.ToString();
                await requestRepo.UpdateAsync(request);

                _logger.LogInformation("Serverless request_id={RequestId}, polling...", serverlessRequestId);
            }
            else
            {
                serverlessRequestId = request.ServerlessRequestId;
                _logger.LogInformation("Resuming polling for existing serverless request_id={RequestId}", serverlessRequestId);
            }

            // Bước 2: Poll GET /progress cho đến khi completed/failed
            var reachedTerminalState = await PollProgressAsync(serverless, serverlessRequestId, request, requestRepo, signalRService);

            if (!reachedTerminalState)
            {
                _backgroundJobClient.Schedule<AutoSchedulingHangfireJob>(
                    job => job.ExecuteAsync(scheduleRequestId),
                    TimeSpan.FromSeconds(ResumePollingDelaySeconds));

                _logger.LogWarning(
                    "Polling timed out after {Attempts} attempts for request {RequestId}. Re-scheduled after {Delay}s.",
                    MaxPollAttempts,
                    scheduleRequestId,
                    ResumePollingDelaySeconds);
                return;
            }

            if (request.Status.Equals(ScheduleEnum.FAILED.ToString(), StringComparison.OrdinalIgnoreCase))
                throw new Exception(request.ErrorMessage ?? "Serverless job failed");

            // Bước 3: Lấy lịch GET /jobs/{id}/schedule
            _logger.LogInformation("Fetching schedule result...");
            var scheduleResult = await serverless.GetScheduleAsync(serverlessRequestId);

            var selected = scheduleResult.GetProperty("selected");
            var assignments = selected.GetProperty("assignments");

            _logger.LogInformation("Processing {Count} assignments...", assignments.GetArrayLength());

            // Load rooms của department, map theo index (P-01 → room đầu tiên, P-02 → room thứ 2...)
            var departmentRooms = await roomRepo.GetRoomByDepartmentIdAsync(request.DepartmentId);
            var roomsByIndex = departmentRooms.OrderBy(r => r.Id).ToList();

            var employeeRepo = scope.ServiceProvider.GetRequiredService<IEmployeeRepository>();

            foreach (var assignment in assignments.EnumerateArray())
            {
                var shift = assignment.GetProperty("shift").GetString() ?? "";
                var dateStr = assignment.GetProperty("date").GetString()!;
                var date = DateOnly.Parse(dateStr);
                var roomCode = assignment.TryGetProperty("room", out var roomProp)
                    ? roomProp.GetString() ?? ""
                    : "";
                var doctorIdsFromResponse = assignment.GetProperty("doctor_ids")
                    .EnumerateArray()
                    .Select(x => x.GetString()!)
                    .ToList();

                var workShift = shift.ToLower() == "morning"
                    ? WorkShiftEnum.Morning
                    : WorkShiftEnum.Afternoon;

                // Map RoomId theo index P-01...
                int? roomId = null;
                if (!string.IsNullOrEmpty(roomCode))
                {
                    var parts = roomCode.Split('-');
                    if (parts.Length >= 2 && int.TryParse(parts.Last(), out var roomIndex) && roomIndex >= 1 && roomIndex <= roomsByIndex.Count)
                    {
                        roomId = roomsByIndex[roomIndex - 1].Id;
                    }
                }

                var taskRegistrations = new List<RequestTaskRegistrationDTO>();
                foreach (var dIdStr in doctorIdsFromResponse)
                {
                    if (Guid.TryParse(dIdStr, out var dId))
                    {
                        // Kiểm tra trực tiếp xem ID là EmployeeId hay DoctorId
                        var account = await employeeRepo.GetEmployeeByIdAsync(dId);
                        if (account == null) account = await employeeRepo.GetDoctorByDoctorIdAsync(dId);

                        if (account?.Employee != null && (
                            account.Employee.RoleId.Equals(RoleEnum.doctor.ToString(), StringComparison.OrdinalIgnoreCase) ||
                            account.Employee.RoleId.Equals(RoleEnum.hod.ToString(), StringComparison.OrdinalIgnoreCase)))
                        {
                            taskRegistrations.Add(new RequestTaskRegistrationDTO { EmployeeId = account.Employee.Id });
                        }
                        else
                        {
                            _logger.LogWarning("ID {Id} could not be resolved to a valid doctor/hod in Dept {DeptId}. SKIPPING.", dId, request.DepartmentId);
                        }
                    }
                }

                var taskItemDto = new RequestTaskItemDTO
                {
                    TaskName = $"Ca {shift} - {date:dd/MM/yyyy}",
                    Date = date,
                    WorkShift = workShift,
                    Description = "Tự động xếp lịch",
                    DepartmentId = request.DepartmentId,
                    RoomId = roomId,
                    TaskRegistrations = taskRegistrations
                };

                if (taskItemDto.TaskRegistrations.Any()) 
                {
                    var createResult = await taskItemService.CreateTaskItemAsync(taskItemDto, taskItemDto.TaskRegistrations);
                    if (!createResult.IsSuccess)
                    {
                        _logger.LogError("Failed to create TaskItem for {Date} {Shift}: {Msg}", date, shift, createResult.Message);
                    }
                }
                else 
                {
                    _logger.LogWarning("Skipping TaskItem for {Date} {Shift} - No valid doctors mapped.", date, shift);
                }
            }

            // Lưu toàn bộ result vào DB
            request.Status = ScheduleEnum.COMPLETED.ToString();
            request.ProgressPercent = 100;
            request.ResultData = scheduleResult.GetRawText(); // lưu raw JSON
            await requestRepo.UpdateAsync(request);

            _logger.LogInformation("AutoSchedulingJob DONE — RequestId={Id}", scheduleRequestId);

            // Notify user và department
            await NotifyCompleted(signalRService, request);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "AutoSchedulingJob FAILED — RequestId={Id}", scheduleRequestId);

            request.Status = ScheduleEnum.FAILED.ToString();
            request.ErrorMessage = ex.Message;
            await requestRepo.UpdateAsync(request);

            await NotifyFailed(signalRService, request, ex.Message);
            throw;
        }
    }

    private async Task<bool> PollProgressAsync(
        ScheduleServerlessService serverless,
        string serverlessRequestId,
        ScheduleRequest request,
        IScheduleRequestRepository requestRepo,
        SignalRService signalRService)
    {
        for (int attempt = 0; attempt < MaxPollAttempts; attempt++)
        {
            await Task.Delay(PollIntervalSeconds * 1000);

            var progress = await serverless.GetProgressAsync(serverlessRequestId);

            var status = progress.GetProperty("status").GetString() ?? "";
            var percent = progress.GetProperty("progress_percent").GetDouble();
            var message = progress.TryGetProperty("message", out var msg) ? msg.GetString() ?? "" : "";

            request.Status = status;
            request.ProgressPercent = (int)percent;
            await requestRepo.UpdateAsync(request);

            _logger.LogInformation("Progress: {Status} - {Percent}%", status, percent);

            await signalRService.SendSchedulingToUser(
                request.RequestedBy.ToString(),
                JsonSerializer.Serialize(new NotificationDTO
                {
                    Title = "Đang xếp lịch...",
                    Message = $"Tiến độ: {percent:F0}% - {message}",
                    NotificationType = NotificationTypeEnum.Info.ToString(),
                    CreatedAt = DateTime.UtcNow,
                    Data = new Dictionary<string, object>
                    {
                        ["requestId"] = request.Id,
                        ["progressPercent"] = percent,
                        ["status"] = status
                    }
                }));

            if (status.Equals(ScheduleEnum.COMPLETED.ToString(), StringComparison.OrdinalIgnoreCase)
                || status.Equals(ScheduleEnum.FAILED.ToString(), StringComparison.OrdinalIgnoreCase))
            {
                if (status.Equals(ScheduleEnum.FAILED.ToString(), StringComparison.OrdinalIgnoreCase))
                {
                    var error = progress.TryGetProperty("error", out var e) ? e.GetString() : "Unknown error";
                    request.ErrorMessage = error;
                }
                return true;
            }
        }

        return false;
    }

    private async Task NotifyCompleted(SignalRService signalRService, ScheduleRequest request)
    {
        var payload = JsonSerializer.Serialize(new NotificationDTO
        {
            Title = "Xếp lịch hoàn tất",
            Message = "Lịch ca trực đã được xếp xong. Bấm để xem kết quả.",
            NotificationType = NotificationTypeEnum.Info.ToString(),
            CreatedAt = DateTime.UtcNow,
            Data = new Dictionary<string, object>
            {
                ["requestId"] = request.Id,
                ["departmentId"] = request.DepartmentId,
                ["progressPercent"] = 100,
                ["status"] = ScheduleEnum.COMPLETED.ToString().ToLower()
            }
        });

        await signalRService.SendSchedulingToUser(request.RequestedBy.ToString(), payload);
        await signalRService.SendSchedulingToDepartment(request.DepartmentId, JsonSerializer.Serialize(new NotificationDTO
        {
            Title = "Lịch ca trực mới",
            Message = $"Lịch ca trực từ {request.StartDate:dd/MM} ({request.NumDays} ngày) đã có. Xem ngay!",
            NotificationType = NotificationTypeEnum.Info.ToString(),
            CreatedAt = DateTime.UtcNow,
            Data = new Dictionary<string, object>
            {
                ["requestId"] = request.Id,
                ["startDate"] = request.StartDate.ToString("yyyy-MM-dd"),
                ["numDays"] = request.NumDays
            }
        }));
    }

    private async Task NotifyFailed(SignalRService signalRService, ScheduleRequest request, string errorMessage)
    {
        await signalRService.SendSchedulingToUser(
            request.RequestedBy.ToString(),
            JsonSerializer.Serialize(new NotificationDTO
            {
                Title = "Xếp lịch thất bại",
                Message = $"Xếp lịch thất bại: {errorMessage}",
                NotificationType = NotificationTypeEnum.Error.ToString(),
                CreatedAt = DateTime.UtcNow,
                Data = new Dictionary<string, object>
                {
                    ["requestId"] = request.Id,
                    ["progressPercent"] = request.ProgressPercent,
                    ["status"] = ScheduleEnum.FAILED.ToString().ToLower()
                }
            }));
    }
}

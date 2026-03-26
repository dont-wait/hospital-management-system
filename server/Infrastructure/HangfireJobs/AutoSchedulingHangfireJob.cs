
using System.Text.Json;
using Domain.Entities.ScheduleTask;
using Domain.Enums;
using Hangfire;
using Infrastructure.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Application.Common.Interface.Scheduling;

namespace Infrastructure.HangfireJobs;

public class AutoSchedulingHangfireJob
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<AutoSchedulingHangfireJob> _logger;
    private const int PollIntervalSeconds = 3;
    private const int MaxPollAttempts = 100; // tăng lên vì NSGA-II chạy lâu

    public AutoSchedulingHangfireJob(IServiceScopeFactory scopeFactory, ILogger<AutoSchedulingHangfireJob> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    [AutomaticRetry(Attempts = 2, DelaysInSeconds = new[] { 30, 120 })]
    [Queue("scheduling")]
    public async Task ExecuteAsync(long scheduleRequestId)
    {
        _logger.LogInformation("AutoSchedulingJob START — RequestId={Id}", scheduleRequestId);

        using var scope = _scopeFactory.CreateScope();
        var requestRepo = scope.ServiceProvider.GetRequiredService<IScheduleRequestRepository>();
        var serverless = scope.ServiceProvider.GetRequiredService<ScheduleServerlessService>(); // dùng service thay vì httpClient thô
        var taskItemService = scope.ServiceProvider.GetRequiredService<ITaskItemService>();
        var signalRService = scope.ServiceProvider.GetRequiredService<SignalRService>();

        var request = await requestRepo.GetByIdAsync(scheduleRequestId);
        if (request == null)
        {
            _logger.LogError("ScheduleRequest {Id} not found", scheduleRequestId);
            return;
        }

        try
        {
            // Bước 1: Gọi POST /run
            request.Status = ScheduleEnum.QUEUED.ToString();
            await requestRepo.UpdateAsync(request);

            _logger.LogInformation("Calling serverless /run...");

            var payload = JsonSerializer.Deserialize<object>(request.RequestPayload!);
            var runResult = await serverless.RunAsync(payload!);

            var serverlessRequestId = runResult.GetProperty("request_id").GetString()
                ?? throw new Exception("Serverless did not return request_id");

            request.ServerlessRequestId = serverlessRequestId;
            request.Status = runResult.GetProperty("status").GetString() ?? ScheduleEnum.QUEUED.ToString();
            await requestRepo.UpdateAsync(request);

            _logger.LogInformation("Serverless request_id={RequestId}, polling...", serverlessRequestId);

            // Bước 2: Poll GET /progress cho đến khi completed/failed
            await PollProgressAsync(serverless, serverlessRequestId, request, requestRepo, signalRService);

            if (request.Status.ToLower() == "failed")
                throw new Exception(request.ErrorMessage ?? "Serverless job failed");

            // Bước 3: Lấy lịch GET /jobs/{id}/schedule
            _logger.LogInformation("Fetching schedule result...");
            var scheduleResult = await serverless.GetScheduleAsync(serverlessRequestId);

            var selected = scheduleResult.GetProperty("selected");
            var assignments = selected.GetProperty("assignments");

            _logger.LogInformation("Processing {Count} assignments...", assignments.GetArrayLength());

            foreach (var assignment in assignments.EnumerateArray())
            {
                var shift = assignment.GetProperty("shift").GetString() ?? "";
                var date = DateOnly.Parse(assignment.GetProperty("date").GetString()!);
                var doctorIds = assignment.GetProperty("doctor_ids")
                    .EnumerateArray()
                    .Select(x => x.GetString()!)
                    .ToList();

                var workShift = shift.Contains("1") || shift.ToLower().Contains("morning")
                    ? WorkShiftEnum.Morning
                    : WorkShiftEnum.Afternoon;

                var taskItemDto = new RequestTaskItemDTO
                {
                    TaskName = $"Ca {shift} - {date:dd/MM/yyyy}",
                    Date = date,
                    WorkShift = workShift,
                    Description = "Tự động xếp lịch",
                    DepartmentId = request.DepartmentId,
                    TaskRegistrations = doctorIds
                        .Where(id => Guid.TryParse(id, out _))
                        .Select(id => new RequestTaskRegistrationDTO { EmployeeId = Guid.Parse(id) })
                        .ToList()
                };

                var createResult = await taskItemService.CreateTaskItemAsync(taskItemDto, taskItemDto.TaskRegistrations);
                if (!createResult.IsSuccess)
                    _logger.LogWarning("Failed to create TaskItem: {Msg}", createResult.Message);
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

    private async Task PollProgressAsync(
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

            await signalRService.SendToUser(
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

            if (status.ToLower() is "completed" or "failed")
            {
                if (status.ToLower() == "failed")
                {
                    var error = progress.TryGetProperty("error", out var e) ? e.GetString() : "Unknown error";
                    request.ErrorMessage = error;
                }
                return;
            }
        }

        throw new Exception("Serverless timeout - max poll attempts reached");
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
                ["progressPercent"] = 100
            }
        });

        await signalRService.SendToUser(request.RequestedBy.ToString(), payload);
        await signalRService.SendToDepartment(request.DepartmentId, JsonSerializer.Serialize(new NotificationDTO
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
        await signalRService.SendToUser(
            request.RequestedBy.ToString(),
            JsonSerializer.Serialize(new NotificationDTO
            {
                Title = "Xếp lịch thất bại",
                Message = $"Xếp lịch thất bại: {errorMessage}",
                NotificationType = NotificationTypeEnum.Error.ToString(),
                CreatedAt = DateTime.UtcNow
            }));
    }
}


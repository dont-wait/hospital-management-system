using Microsoft.AspNetCore.SignalR;

public class SignalRService
{
    private readonly IHubContext<NotificationHub> _notificationHub;
    private readonly IHubContext<SchedulingHub> _schedulingHub;

    public SignalRService(
        IHubContext<NotificationHub> notificationHub,
        IHubContext<SchedulingHub> schedulingHub)
    {
        _notificationHub = notificationHub;
        _schedulingHub = schedulingHub;
    }

    public async Task SendToUser(string userId, string message)
    {
        await _notificationHub.Clients.Group(userId)
            .SendAsync("ReceiveNotification", userId, message);
    }

    public async Task SendToDepartment(int departmentId, string message)
    {
        await _schedulingHub.Clients.Group($"dept_{departmentId}")
            .SendAsync("ReceiveNotification", $"dept_{departmentId}", message);
    }

    public async Task SendToAll(string message)
    {
        await _notificationHub.Clients.All
            .SendAsync("ReceiveNotification", "ALL", message);
    }
}

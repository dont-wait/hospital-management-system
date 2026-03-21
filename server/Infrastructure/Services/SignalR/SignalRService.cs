using Microsoft.AspNetCore.SignalR;

public class SignalRService
{
    private readonly IHubContext<NotificationHub> _hubContext;

    public SignalRService(IHubContext<NotificationHub> hubContext)
    {
        _hubContext = hubContext;
    }

    // gửi cho 1 doctor
    public async Task SendToUser(string userId, string message)
    {
        await _hubContext.Clients.Group(userId)
            .SendAsync("ReceiveNotification", userId, message);
    }

    // gửi cho tất cả
    public async Task SendToAll(string message)
    {
        await _hubContext.Clients.All
            .SendAsync("ReceiveNotification", "ALL", message);
    }
}
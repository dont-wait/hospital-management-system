using Microsoft.AspNetCore.SignalR;

public class NotificationHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        var userId = Context.GetHttpContext()?.Request.Query["userId"].ToString();

        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userId);
        }

        await base.OnConnectedAsync();
    }


    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await base.OnDisconnectedAsync(exception);
    }


    public async Task SendNotification(string targetUser, string message)
    {
        await Clients.Group(targetUser)
            .SendAsync("ReceiveNotification", targetUser, message);
    }
}

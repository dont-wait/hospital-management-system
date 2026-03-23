
using Microsoft.AspNetCore.SignalR;

public class SchedulingHub : Hub
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
        // Khi client mất kết nối
        await base.OnDisconnectedAsync(exception);
    }


    public async Task SendNotification(string targetUser, string message)
    {
        await Clients.Group(targetUser)
            .SendAsync("ReceiveNotification", targetUser, message);
    }

    public async Task SendEmployeeOfDepartment(int departmentId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"dept_{departmentId}");
    }
}

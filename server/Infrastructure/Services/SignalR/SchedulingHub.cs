using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

[Authorize]
public class SchedulingHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? Context.User?.FindFirstValue(JwtRegisteredClaimNames.Sub)
            ?? Context.User?.FindFirstValue("sub");

        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userId);
            await base.OnConnectedAsync();
            return;
        }

        Context.Abort();
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

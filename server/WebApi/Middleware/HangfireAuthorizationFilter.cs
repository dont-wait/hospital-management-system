using Hangfire.Dashboard;

namespace WebApi.Middleware;

public class HangfireAuthorizationFilter : IDashboardAuthorizationFilter
{
    public bool Authorize(DashboardContext context)
    {
        // Allow access in development
        // In production, you should check authentication
        return true;
    }
}

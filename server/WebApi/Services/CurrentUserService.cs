using System.Security.Claims;

namespace WebApi.Services;
public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    private ClaimsPrincipal? User => _httpContextAccessor.HttpContext?.User;
    public Guid? CurrentUserId
    => User != null && Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var guid)
        ? guid
        : (Guid?)null;
    public string RoleId => User != null ? User.FindFirstValue("RoleId")! : "";
}
namespace WebApi.Middleware;

public class CookieToHeaderMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<CookieToHeaderMiddleware> _logger;

    public CookieToHeaderMiddleware(RequestDelegate next, ILogger<CookieToHeaderMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            // Lấy accessToken từ cookie
            var token = context.Request.Cookies["accessToken"];
            
            // Nếu có token và chưa có Authorization header, thêm vào
            if (!string.IsNullOrEmpty(token) && !context.Request.Headers.ContainsKey("Authorization"))
            {
                context.Request.Headers.Append("Authorization", $"Bearer {token}");
                _logger.LogDebug("Added Authorization header from cookie for request: {Path}", context.Request.Path);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in CookieToHeaderMiddleware");
            // Không throw exception, để request tiếp tục
        }

        await _next(context);
    }
}
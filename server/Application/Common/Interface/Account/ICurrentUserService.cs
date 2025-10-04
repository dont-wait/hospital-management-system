public interface ICurrentUserService
{
    Guid? CurrentUserId { get; }
    string RoleId { get; }
}
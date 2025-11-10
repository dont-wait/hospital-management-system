
public abstract class BaseEntity
{
    public int Version { get; set; } = 1;
    public Guid CreatedId { get; set; }

    public Guid? ModifiedId { get; set; } = null;
    public Guid? DeletedId { get; set; } = null;
    public DateTimeOffset? DeletedAt { get; set; } = null;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? UpdatedAt { get; set; } = null;
}
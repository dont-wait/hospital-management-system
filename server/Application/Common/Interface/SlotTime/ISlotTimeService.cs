public interface ISlotTimeService
{
    T GetSlotTimeConfig<T>() where T : class, new();
}
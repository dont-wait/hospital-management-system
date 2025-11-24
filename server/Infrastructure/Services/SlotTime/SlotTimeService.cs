using Infrastructure.Services.SlotTime;
using Microsoft.Extensions.Options;

public class SlotTimeService : ISlotTimeService
{
    private readonly SlotTimeConfig _slotTimeConfig;

    public SlotTimeService(IOptions<SlotTimeConfig> slotTimeConfig)
    {
        _slotTimeConfig = slotTimeConfig.Value;
    }

    public T GetSlotTimeConfig<T>() where T : class, new()
    {
        if (typeof(T) == typeof(SlotTimeConfig))
        {
            return _slotTimeConfig as T ?? new T();
        }

        throw new InvalidOperationException($"Không hỗ trợ loại cấu hình: {typeof(T).FullName}");
    }
}
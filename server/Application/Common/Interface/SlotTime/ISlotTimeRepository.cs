public interface ISlotTimeRepository
{
    Task<List<SlotTime>> GetSlotTimesAsync(Specification<SlotTime> spec);
    Task<SlotTime?> GetSlotTimeByIdAsync(Specification<SlotTime> spec);
    Task AddSlotTimeAsync(SlotTime slot);
    Task UpdateSlotTimeAsync(SlotTime slot);
    Task<bool> DeleteAsync(SlotTime slot);
}
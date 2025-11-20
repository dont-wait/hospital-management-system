public interface ISlotTimeRepository
{
    Task<bool?> IsAvailableSlotTimeForBookAsync(long slotTimeId); //Con` dang ky duoc
    void UpdateAsync(SlotTime slotTime); 
}
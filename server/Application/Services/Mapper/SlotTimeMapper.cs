using Application.Common.DTOs.SlotTime;
using Application.Common.Interface.Mappers;

public class SlotTimeMapper : ISlotTimeMapper
{

    public ResponseSlotTimeDTO MapToDto(SlotTime slotTime)
    {
        return new ResponseSlotTimeDTO
        {
            SlotId = slotTime.Id,
            SlotStatus = slotTime.SlotStatus,
            SlotStartTime = slotTime.SlotStartTime,
            SlotEndTime = slotTime.SlotEndTime
        };
    }
    
    //TODO: Create slot when xep lich
    public SlotTime MapToEntity(RequestSlotTimeDTO slotTimeDto)
    {
        return new SlotTime
        {
            Id = slotTimeDto.SlotId,
            SlotStatus = slotTimeDto.SlotStatus,
            SlotStartTime = slotTimeDto.SlotStartTime,
            SlotEndTime = slotTimeDto.SlotEndTime,
            
            
        };
    }
}
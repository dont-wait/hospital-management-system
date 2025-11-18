using Application.Common.DTOs.SlotTime;

namespace Application.Common.Interface.Mappers;
public interface ISlotTimeMapper
{
    ResponseSlotTimeDTO MapToDto(SlotTime slotTime);
    SlotTime MapToEntity(RequestSlotTimeDTO slotTimeDto);
}
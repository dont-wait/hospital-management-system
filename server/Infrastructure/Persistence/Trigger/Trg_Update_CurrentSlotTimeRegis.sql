CREATE TRIGGER Trg_Update_CurrentSlotTimeRegis
    ON slot_times
    AFTER INSERT, UPDATE, DELETE
    AS
BEGIN
    SET NOCOUNT ON;

    -- Giảm số lượng cho slot cũ (khi xóa hoặc soft delete)
UPDATE slot_times
SET CurrentAppointments = st.CurrentAppointments - 1
    FROM slot_times st
    INNER JOIN deleted d ON st.Id = d.Id
WHERE d.DeletedAt IS NULL;

-- Tăng số lượng cho slot mới (khi thêm hoặc khôi phục)
UPDATE slot_times
SET CurrentAppointments = st.CurrentAppointments + 1
    FROM slot_times st
    INNER JOIN inserted i ON st.Id = i.Id
WHERE i.DeletedAt IS NULL;
END;

DISABLE TRIGGER Trg_Update_CurrentSlotTimeRegis ON slot_times;



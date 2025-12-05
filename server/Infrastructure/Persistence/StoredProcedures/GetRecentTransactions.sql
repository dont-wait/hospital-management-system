-- =============================================
-- Stored Procedure: GetRecentTransactions
-- Description: Lấy n giao dịch (billing) gần nhất với phân trang
-- Parameters: 
--   @PageNumber - Số trang (mặc định 1)
--   @PageSize - Số lượng giao dịch mỗi trang (mặc định 5)
-- Returns: Tên bệnh nhân, tên dịch vụ, số tiền, thời gian, trạng thái, tổng số bản ghi
-- =============================================

CREATE OR ALTER PROCEDURE PC_GetRecentTransactions
    @PageNumber INT = 1,
    @PageSize INT = 5
AS
BEGIN
    SET NOCOUNT ON;

    -- Tính offset
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;

    -- Lấy tổng số bản ghi
    DECLARE @TotalRecords INT;
    
    SELECT @TotalRecords = COUNT(*)
    FROM billings b
    INNER JOIN appointments a ON b.Id = a.BillingId
    INNER JOIN patients p ON a.PatientId = p.Id
    INNER JOIN services s ON a.ServiceId = s.Id
    WHERE b.DeletedAt IS NULL
        AND a.DeletedAt IS NULL
        AND p.DeletedAt IS NULL
        AND s.DeletedAt IS NULL;

    -- Lấy dữ liệu với phân trang
    SELECT
        -- Tên bệnh nhân (FirstName + LastName)
        CONCAT(p.FirstName, ' ', p.LastName) AS PatientName,
        
        -- Tên dịch vụ
        s.Name AS ServiceName,
        
        -- Số tiền thanh toán
        b.PaymentAmount AS Amount,
        
        -- Thời gian tạo billing
        b.CreatedAt AS TransactionTime,
        
        -- Trạng thái billing
        b.BillingStatus AS Status,
        
        -- Thông tin phân trang
        @TotalRecords AS TotalRecords,
        @PageNumber AS CurrentPage,
        @PageSize AS PageSize,
        CEILING(CAST(@TotalRecords AS FLOAT) / @PageSize) AS TotalPages
        
    FROM billings b
    INNER JOIN appointments a ON b.Id = a.BillingId
    INNER JOIN patients p ON a.PatientId = p.Id
    INNER JOIN services s ON a.ServiceId = s.Id
    
    WHERE b.DeletedAt IS NULL
        AND a.DeletedAt IS NULL
        AND p.DeletedAt IS NULL
        AND s.DeletedAt IS NULL
    
    ORDER BY b.CreatedAt DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
GO

EXEC GetRecentTransactions
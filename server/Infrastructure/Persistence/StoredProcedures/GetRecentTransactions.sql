-- =============================================
-- Stored Procedure: GetRecentTransactions
-- Description: Lấy n giao dịch (billing) gần nhất với phân trang và lọc theo khoảng ngày
-- Parameters: 
--   @PageNumber - Số trang (mặc định 1)
--   @PageSize - Số lượng giao dịch mỗi trang (mặc định 5)
--   @FromDate - Ngày bắt đầu (tùy chọn, format: YYYY-MM-DD)
--   @ToDate - Ngày kết thúc (tùy chọn, format: YYYY-MM-DD)
-- Returns: Tên bệnh nhân, tên dịch vụ, số tiền, thời gian, trạng thái, tổng số bản ghi
-- =============================================

CREATE OR ALTER PROCEDURE PC_GetRecentTransactions
    @PageNumber INT = 1,
    @PageSize INT = 5,
    @FromDate DATE = NULL,
    @ToDate DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Tính offset
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;

    -- Tổng số bản ghi
    DECLARE @TotalRecords INT;
    
    SELECT @TotalRecords = COUNT(*)
    FROM billings b
    INNER JOIN appointments a ON b.Id = a.BillingId
    INNER JOIN patients p ON a.PatientId = p.Id
    INNER JOIN services s ON a.ServiceId = s.Id
    WHERE b.DeletedAt IS NULL
        AND a.DeletedAt IS NULL
        AND p.DeletedAt IS NULL
        AND s.DeletedAt IS NULL
        AND (@FromDate IS NULL OR CAST(b.CreatedAt AS DATE) >= @FromDate)
        AND (@ToDate IS NULL OR CAST(b.CreatedAt AS DATE) <= @ToDate);

    -- Lấy dữ liệu với phân trang và lọc theo khoảng ngày
    SELECT
        -- Tên bệnh nhân (FirstName + LastName)
        CONCAT(p.FirstName, ' ', p.LastName) AS PatientName,
        
        -- Tên dịch vụ
        s.Name AS ServiceName,
        
        -- Số tiền thanh toán (cast sang decimal)
        CAST(b.PaymentAmount AS DECIMAL(18, 2)) AS Amount,
        
        -- Thời gian giao dịch (cast sang datetime)
        CAST(b.CreatedAt AS DATETIME) AS TransactionDate,
        
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
        AND (@FromDate IS NULL OR CAST(b.CreatedAt AS DATE) >= @FromDate)
        AND (@ToDate IS NULL OR CAST(b.CreatedAt AS DATE) <= @ToDate)
    
    ORDER BY b.CreatedAt DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
GO

-- Ví dụ sử dụng:
-- Lấy tất cả giao dịch gần nhất
EXEC PC_GetRecentTransactions;

-- Lọc theo khoảng ngày
-- EXEC PC_GetRecentTransactions @FromDate = '2025-12-01', @ToDate = '2025-12-05';
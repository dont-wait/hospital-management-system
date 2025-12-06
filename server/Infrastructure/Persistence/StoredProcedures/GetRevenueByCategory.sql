-- =============================================
-- Stored Procedure: GetRevenueByCategory
-- Description: Tính tổng doanh thu từ appointments và services theo khoảng thời gian
-- Parameters: 
--   @TimeRange - Khoảng thời gian: 'day', 'week', 'month', 'year', 'range' (tùy chọn)
--   @FromDate - Ngày bắt đầu (tùy chọn, mặc định là ngày hiện tại)
--   @ToDate - Ngày kết thúc (tùy chọn, chỉ dùng cho type='range')
-- Returns: 1 bảng với 2 cột: Appointment và Service
-- =============================================

CREATE OR ALTER PROCEDURE PC_GetRevenueByCategory
    @TimeRange NVARCHAR(20) = NULL,
    @FromDate DATETIME = NULL,
    @ToDate DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @StartDate DATETIME;
    DECLARE @EndDate DATETIME;
    DECLARE @ReferenceDate DATETIME;

    -- Nếu không truyền FromDate thì dùng ngày hiện tại
    SET @ReferenceDate = ISNULL(@FromDate, GETDATE());

    -- Xác định khoảng thời gian dựa trên @TimeRange
    IF @TimeRange = 'day'
    BEGIN
        -- If fromDate is provided, calculate from fromDate to today
        -- Otherwise, just today
        IF @FromDate IS NOT NULL
        BEGIN
            SET @StartDate = CAST(@FromDate AS DATE);
            SET @EndDate = CAST(GETDATE() AS DATE);
            SET @EndDate = DATEADD(DAY, 1, @EndDate); -- Include today
        END
        ELSE
        BEGIN
            -- Just today
            SET @StartDate = CAST(@ReferenceDate AS DATE);
            SET @EndDate = DATEADD(DAY, 1, @StartDate);
        END
    END
    ELSE IF @TimeRange = 'week'
    BEGIN
        DECLARE @RefDate DATE = ISNULL(@FromDate, @ReferenceDate);
        SET @StartDate = DATEADD(DAY, -(DATEPART(WEEKDAY, @RefDate) - 2), @RefDate);
        IF DATEPART(WEEKDAY, @RefDate) = 1
            SET @StartDate = DATEADD(DAY, -6, @RefDate);
        SET @EndDate = DATEADD(DAY, 7, @StartDate);
    END
    ELSE IF @TimeRange = 'month'
    BEGIN
        SET @RefDate = ISNULL(@FromDate, @ReferenceDate);
        SET @StartDate = DATEFROMPARTS(YEAR(@RefDate), MONTH(@RefDate), 1);
        SET @EndDate = DATEADD(MONTH, 1, @StartDate);
    END
    ELSE IF @TimeRange = 'year'
    BEGIN
        SET @RefDate = ISNULL(@FromDate, @ReferenceDate);
        SET @StartDate = DATEFROMPARTS(YEAR(@RefDate), 1, 1);
        SET @EndDate = DATEADD(YEAR, 1, @StartDate);
    END
    ELSE IF @TimeRange = 'range'
    BEGIN
        -- Custom date range
        SET @StartDate = CAST(@FromDate AS DATE);
        SET @EndDate = ISNULL(CAST(@ToDate AS DATE), CAST(GETDATE() AS DATE));
        SET @EndDate = DATEADD(DAY, 1, @EndDate); -- Include end date
    END
    ELSE IF @TimeRange IS NULL
    BEGIN
        -- Nếu không truyền TimeRange, lấy tất cả
        SET @StartDate = '1900-01-01';
        SET @EndDate = GETDATE();
    END
    ELSE
    BEGIN
        RAISERROR('Thời gian không hợp lệ. Giá trị hợp lệ là: day, week, month, year, range', 16, 1);
        RETURN;
    END

    SELECT
        -- Tổng doanh thu từ appointments (tất cả các service)
        ISNULL(SUM(b.PaymentAmount), 0) AS 'Khám bệnh',
        
        -- Tổng doanh thu từ services (chỉ các appointment có ServiceType cụ thể, không phải khám bệnh thông thường)
        ISNULL(SUM(CASE 
            WHEN s.Id != '5' THEN b.PaymentAmount 
            ELSE 0 
        END), 0) AS 'Dịch vụ'
    FROM appointments a
    INNER JOIN billings b ON a.BillingId = b.Id
    INNER JOIN services s ON a.ServiceId = s.Id
    WHERE 
        a.DeletedAt IS NULL
        AND b.DeletedAt IS NULL
        AND s.DeletedAt IS NULL
        AND b.BillingStatus = 'Paid'
        AND a.CreatedAt >= @StartDate
        AND a.CreatedAt < @EndDate;
END
GO
-- Tất cả dữ liệu
EXEC PC_GetRevenueByCategory

-- Doanh thu hôm nay
EXEC PC_GetRevenueByCategory @TimeRange = 'day'

-- Doanh thu tuần này
EXEC PC_GetRevenueByCategory @TimeRange = 'week'

-- Doanh thu tháng 12/2025
EXEC PC_GetRevenueByCategory @TimeRange = 'month', @FromDate = '2025-12-04'

-- Doanh thu năm 2025
EXEC PC_GetRevenueByCategory @TimeRange = 'year', @FromDate = '2025-12-31'

-- Doanh thu từ ngày 1/12 đến 6/12
EXEC PC_GetRevenueByCategory @TimeRange = 'range', @FromDate = '2025-12-01', @ToDate = '2025-12-06'
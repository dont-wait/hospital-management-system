-- =============================================
-- Stored Procedure: GetAllRevenue
-- Description: Trả về doanh thu theo khoảng thời gian, phù hợp với biểu đồ
-- Parameters: 
--   @TimeRange - Khoảng thời gian: 'day', 'week', 'month', 'year', 'range'
--   @ReferenceDate - Ngày tham chiếu (mặc định là ngày hiện tại) hoặc ngày bắt đầu khi type='range'
--   @ToDate - Ngày kết thúc (chỉ dùng khi type='range')
-- Returns: Label và Revenue tương ứng cho từng khoảng thời gian
-- =============================================

CREATE OR ALTER PROCEDURE PC_GetAllRevenue
    @TimeRange NVARCHAR(20), -- 'day', 'week', 'month', 'year', 'range'
    @ReferenceDate DATETIME = NULL,
    @ToDate DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @ReferenceDate IS NULL
        SET @ReferenceDate = GETDATE();

    DECLARE @StartDate DATETIME;
    DECLARE @EndDate DATETIME;

    IF @TimeRange = 'day'
    BEGIN
        SET @StartDate = CAST(CAST(@ReferenceDate AS DATE) AS DATETIME);
        SET @EndDate = DATEADD(DAY, 1, @StartDate);

        -- Trả về doanh thu theo từng giờ trong ngày (0h, 4h, 8h, 12h, 16h, 20h, 24h)
        ;WITH HourRanges AS (
            SELECT 0 AS HourStart, 4 AS HourEnd, N'0h' AS Label
            UNION ALL SELECT 4, 8, N'4h'
            UNION ALL SELECT 8, 12, N'8h'
            UNION ALL SELECT 12, 16, N'12h'
            UNION ALL SELECT 16, 20, N'16h'
            UNION ALL SELECT 20, 24, N'20h'
            UNION ALL SELECT 24, 24, N'24h' -- Điểm cuối
        )
        SELECT 
            hr.Label,
            ISNULL(SUM(CASE WHEN b.BillingStatus = 'Paid' THEN b.PaymentAmount ELSE 0 END), 0) / 1000000.0 AS Revenue
        FROM HourRanges hr
        LEFT JOIN appointments a ON 
            CAST(a.CreatedAt AS DATE) = CAST(@ReferenceDate AS DATE)
            AND DATEPART(HOUR, a.CreatedAt) >= hr.HourStart 
            AND DATEPART(HOUR, a.CreatedAt) < hr.HourEnd
            AND a.DeletedAt IS NULL
        LEFT JOIN billings b ON a.BillingId = b.Id AND b.DeletedAt IS NULL
        GROUP BY hr.HourStart, hr.Label
        ORDER BY hr.HourStart;
    END
    ELSE IF @TimeRange = 'week'
    BEGIN
        SET @StartDate = DATEADD(DAY, -(DATEPART(WEEKDAY, @ReferenceDate) - 2), CAST(@ReferenceDate AS DATE));
        IF DATEPART(WEEKDAY, @ReferenceDate) = 1
            SET @StartDate = DATEADD(DAY, -6, CAST(@ReferenceDate AS DATE));
        SET @EndDate = DATEADD(DAY, 7, @StartDate);

        -- Trả về doanh thu theo từng ngày trong tuần (T2, T3, T4, T5, T6, T7, CN)
        ;WITH WeekDays AS (
            SELECT 2 AS DayOfWeek, N'T2' AS Label
            UNION ALL SELECT 3, N'T3'
            UNION ALL SELECT 4, N'T4'
            UNION ALL SELECT 5, N'T5'
            UNION ALL SELECT 6, N'T6'
            UNION ALL SELECT 7, N'T7'
            UNION ALL SELECT 1, N'CN'
        )
        SELECT 
            wd.Label,
            ISNULL(SUM(CASE WHEN b.BillingStatus = 'Paid' THEN b.PaymentAmount ELSE 0 END), 0) / 1000000.0 AS Revenue
        FROM WeekDays wd
        LEFT JOIN appointments a ON 
            CAST(a.CreatedAt AS DATE) >= @StartDate
            AND CAST(a.CreatedAt AS DATE) < @EndDate
            AND DATEPART(WEEKDAY, a.CreatedAt) = wd.DayOfWeek
            AND a.DeletedAt IS NULL
        LEFT JOIN billings b ON a.BillingId = b.Id AND b.DeletedAt IS NULL
        GROUP BY wd.DayOfWeek, wd.Label
        ORDER BY CASE wd.DayOfWeek WHEN 1 THEN 7 ELSE wd.DayOfWeek - 1 END;
    END
    ELSE IF @TimeRange = 'month'
    BEGIN
        SET @StartDate = DATEFROMPARTS(YEAR(@ReferenceDate), MONTH(@ReferenceDate), 1);
        SET @EndDate = DATEADD(MONTH, 1, @StartDate);

        -- Trả về doanh thu theo từng tuần trong tháng (Tuần 1, Tuần 2, Tuần 3, Tuần 4)
        ;WITH Weeks AS (
            SELECT 1 AS WeekNum, N'Tuần 1' AS Label, @StartDate AS WeekStart, DATEADD(DAY, 7, @StartDate) AS WeekEnd
            UNION ALL SELECT 2, N'Tuần 2', DATEADD(DAY, 7, @StartDate), DATEADD(DAY, 14, @StartDate)
            UNION ALL SELECT 3, N'Tuần 3', DATEADD(DAY, 14, @StartDate), DATEADD(DAY, 21, @StartDate)
            UNION ALL SELECT 4, N'Tuần 4', DATEADD(DAY, 21, @StartDate), @EndDate
        )
        SELECT 
            w.Label,
            ISNULL(SUM(CASE WHEN b.BillingStatus = 'Paid' THEN b.PaymentAmount ELSE 0 END), 0) / 1000000.0 AS Revenue
        FROM Weeks w
        LEFT JOIN appointments a ON 
            CAST(a.CreatedAt AS DATE) >= w.WeekStart
            AND CAST(a.CreatedAt AS DATE) < w.WeekEnd
            AND a.DeletedAt IS NULL
        LEFT JOIN billings b ON a.BillingId = b.Id AND b.DeletedAt IS NULL
        GROUP BY w.WeekNum, w.Label
        ORDER BY w.WeekNum;
    END
    ELSE IF @TimeRange = 'year'
    BEGIN
        SET @StartDate = DATEFROMPARTS(YEAR(@ReferenceDate), 1, 1);
        SET @EndDate = DATEADD(YEAR, 1, @StartDate);

        -- Trả về doanh thu theo từng tháng trong năm (T1, T2, ..., T12)
        ;WITH Months AS (
            SELECT 1 AS MonthNum, N'T1' AS Label
            UNION ALL SELECT 2, N'T2'
            UNION ALL SELECT 3, N'T3'
            UNION ALL SELECT 4, N'T4'
            UNION ALL SELECT 5, N'T5'
            UNION ALL SELECT 6, N'T6'
            UNION ALL SELECT 7, N'T7'
            UNION ALL SELECT 8, N'T8'
            UNION ALL SELECT 9, N'T9'
            UNION ALL SELECT 10, N'T10'
            UNION ALL SELECT 11, N'T11'
            UNION ALL SELECT 12, N'T12'
        )
        SELECT 
            m.Label,
            ISNULL(SUM(CASE WHEN b.BillingStatus = 'Paid' THEN b.PaymentAmount ELSE 0 END), 0) / 1000000.0 AS Revenue
        FROM Months m
        LEFT JOIN appointments a ON 
            YEAR(a.CreatedAt) = YEAR(@ReferenceDate)
            AND MONTH(a.CreatedAt) = m.MonthNum
            AND a.DeletedAt IS NULL
        LEFT JOIN billings b ON a.BillingId = b.Id AND b.DeletedAt IS NULL
        GROUP BY m.MonthNum, m.Label
        ORDER BY m.MonthNum;
    END
    ELSE IF @TimeRange = 'range'
    BEGIN
        -- Custom date range: return daily revenue from @ReferenceDate to @ToDate
        SET @StartDate = CAST(@ReferenceDate AS DATE);
        SET @EndDate = ISNULL(CAST(@ToDate AS DATE), CAST(GETDATE() AS DATE));
        
        -- Generate date series
        ;WITH DateRange AS (
            SELECT CAST(@StartDate AS DATE) AS DateValue
            UNION ALL
            SELECT DATEADD(DAY, 1, DateValue)
            FROM DateRange
            WHERE DateValue < @EndDate
        )
        SELECT 
            FORMAT(dr.DateValue, 'dd/MM') AS Label,
            ISNULL(SUM(CASE WHEN b.BillingStatus = 'Paid' THEN b.PaymentAmount ELSE 0 END), 0) / 1000000.0 AS Revenue
        FROM DateRange dr
        LEFT JOIN appointments a ON 
            CAST(a.CreatedAt AS DATE) = dr.DateValue
            AND a.DeletedAt IS NULL
        LEFT JOIN billings b ON a.BillingId = b.Id AND b.DeletedAt IS NULL
        GROUP BY dr.DateValue
        ORDER BY dr.DateValue
        OPTION (MAXRECURSION 365);
    END
    ELSE
    BEGIN
        RAISERROR('Thời gian không hợp lệ. Giá trị hợp lệ là: day, week, month, year, range', 16, 1);
        RETURN;
    END
END
GO

EXEC PC_GetAllRevenue @TimeRange = 'day'
EXEC PC_GetAllRevenue @TimeRange = 'week', @ReferenceDate = '2025-12-04'
EXEC PC_GetAllRevenue @TimeRange = 'month'
EXEC PC_GetAllRevenue @TimeRange = 'year'
EXEC PC_GetAllRevenue @TimeRange = 'range', @ReferenceDate = '2025-12-01', @ToDate = '2025-12-06'
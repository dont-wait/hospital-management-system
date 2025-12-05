use Hospital

CREATE OR ALTER PROCEDURE PC_GetRevenueAllDepartment
(
    @Type VARCHAR(10),     -- 'day' | 'week' | 'month' | 'year' | 'range'
    @FromDate DATE = NULL,
    @ToDate DATE = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @CurrentDate DATE = GETDATE();

    --------------------------------------------------
    -- 1. Determine date range for current period
    --------------------------------------------------
    DECLARE @StartDate DATE, @EndDate DATE;
    DECLARE @PrevStartDate DATE, @PrevEndDate DATE;

    IF @Type = 'day'
    BEGIN
        SET @StartDate = ISNULL(@FromDate, @CurrentDate);
        SET @EndDate   = ISNULL(@ToDate, @CurrentDate);

        SET @PrevStartDate = DATEADD(DAY, -1, @StartDate);
        SET @PrevEndDate   = DATEADD(DAY, -1, @EndDate);
    END

    ELSE IF @Type = 'week'
    BEGIN
        DECLARE @RefDate DATE = ISNULL(@FromDate, @CurrentDate);
        SET @StartDate = DATEADD(DAY, 1 - DATEPART(WEEKDAY, @RefDate), @RefDate);
        SET @EndDate   = DATEADD(DAY, 7 - DATEPART(WEEKDAY, @RefDate), @RefDate);

        SET @PrevStartDate = DATEADD(WEEK, -1, @StartDate);
        SET @PrevEndDate   = DATEADD(WEEK, -1, @EndDate);
    END

    ELSE IF @Type = 'month'
    BEGIN
        SET @RefDate = ISNULL(@FromDate, @CurrentDate);
        SET @StartDate = DATEFROMPARTS(YEAR(@RefDate), MONTH(@RefDate), 1);
        SET @EndDate   = EOMONTH(@RefDate);

        SET @PrevStartDate = DATEADD(MONTH, -1, @StartDate);
        SET @PrevEndDate   = EOMONTH(@PrevStartDate);
    END

    ELSE IF @Type = 'year'
    BEGIN
        SET @RefDate = ISNULL(@FromDate, @CurrentDate);
        SET @StartDate = DATEFROMPARTS(YEAR(@RefDate), 1, 1);
        SET @EndDate   = DATEFROMPARTS(YEAR(@RefDate), 12, 31);

        SET @PrevStartDate = DATEADD(YEAR, -1, @StartDate);
        SET @PrevEndDate   = DATEADD(YEAR, -1, @EndDate);
    END
    
    ELSE IF @Type = 'range'
    BEGIN
        -- Custom date range
        SET @StartDate = ISNULL(@FromDate, @CurrentDate);
        SET @EndDate   = ISNULL(@ToDate, @CurrentDate);

        -- Calculate previous period with same duration
        DECLARE @DaysDiff INT = DATEDIFF(DAY, @StartDate, @EndDate);
        SET @PrevStartDate = DATEADD(DAY, -(@DaysDiff + 1), @StartDate);
        SET @PrevEndDate   = DATEADD(DAY, -1, @StartDate);
    END;

    --------------------------------------------------
    -- 2. Current revenue + number of appointments
    --------------------------------------------------
    WITH CurrentData AS (
        SELECT
            D.Id,
            D.Name,
            COUNT(A.RoomId) AS total_appointments,
            CAST(SUM(B.PaymentAmount * (1 - ISNULL(B.DiscountAmount, 0))) AS DECIMAL(18, 2)) AS revenue
        FROM departments D
        LEFT JOIN rooms R ON R.Id = D.Id
        LEFT JOIN appointments A ON A.RoomId = R.Id
        LEFT JOIN billings B ON B.Id = A.BillingId
        WHERE B.BillingStatus = 'paid'
          AND CAST(B.CreatedAt AS DATE) BETWEEN @StartDate AND @EndDate
        GROUP BY D.Id, D.Name
    ),

    --------------------------------------------------
    -- 3. Previous period revenue
    --------------------------------------------------
    PreviousData AS (
        SELECT
            D.Id,
            CAST(SUM(B.PaymentAmount * (1 - ISNULL(B.DiscountAmount, 0))) AS DECIMAL(18, 2)) AS revenue
        FROM departments D
        LEFT JOIN rooms R ON R.DepartmentId = D.Id
        LEFT JOIN appointments A ON A.RoomId = R.Id
        LEFT JOIN billings B ON B.Id = A.BillingId
        WHERE B.BillingStatus = 'paid'
          AND CAST(B.CreatedAt AS DATE) BETWEEN @PrevStartDate AND @PrevEndDate
        GROUP BY D.Id
    )

    --------------------------------------------------
    -- 4. Final output: merge + calculate growth rate
    --------------------------------------------------
    SELECT
        C.Id,
        C.Name,
        C.total_appointments,
        C.revenue,
        CASE 
            WHEN P.revenue IS NULL OR P.revenue = 0 THEN NULL
            ELSE ((C.revenue - P.revenue) * 100.0 / P.revenue)
        END AS revenue_growth_percentage
    FROM CurrentData C
    LEFT JOIN PreviousData P ON P.Id = C.Id;
END

-- Ví dụ sử dụng:
-- Theo ngày hiện tại
EXEC PC_GetRevenueAllDepartment @Type = 'day';

-- Theo ngày cụ thể
-- EXEC PC_GetRevenueAllDepartment @Type = 'day', @FromDate = '2025-12-03';

-- Theo khoảng ngày
-- EXEC PC_GetRevenueAllDepartment @Type = 'range', @FromDate = '2025-12-01', @ToDate = '2025-12-05';
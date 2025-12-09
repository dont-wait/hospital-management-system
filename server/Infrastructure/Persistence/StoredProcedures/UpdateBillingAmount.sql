use HSM_DB
go

-- Hàm tính giá dịch vụ
CREATE OR ALTER FUNCTION fn_CalculateBillingAmount(@AppointmentId BIGINT)
RETURNS TABLE
AS
RETURN
(
    SELECT 
        CASE 
            WHEN CAST(a.AppointmentStartTime AS TIME) < '07:00:00' OR CAST(a.AppointmentStartTime AS TIME) > '17:00:00' 
            THEN s.OnDemandPrice
            WHEN p.Is_Insurance = 1 
            THEN s.InsurancePrice
            ELSE s.SelfPrice  
        END AS ServicePrice,
        
        CASE 
            WHEN p.Is_Insurance = 1 THEN 0.8 
            ELSE 0.0                          
        END AS DiscountAmount
        
    FROM Appointments a
    JOIN Services s ON a.ServiceId = s.Id
    JOIN Patients p ON a.PatientId = p.Id
    WHERE a.Id = @AppointmentId
);
GO

CREATE OR ALTER PROCEDURE sp_UpdateBillingAmount
    @AppointmentId BIGINT,
    @Result NVARCHAR(500) OUTPUT
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
    
    DECLARE @BillingId BIGINT;
    DECLARE @ServicePrice FLOAT;
    DECLARE @DiscountAmount FLOAT;
    
    BEGIN TRANSACTION;
    
    SELECT @BillingId = BillingId 
    FROM Appointments 
    WHERE Id = @AppointmentId;
    
    IF @BillingId IS NULL
    BEGIN
        SET @Result = N'Không tìm thấy Appointment';
        ROLLBACK;
        RETURN;
    END
    
    SELECT 
        @ServicePrice = ServicePrice,
        @DiscountAmount = DiscountAmount
    FROM fn_CalculateBillingAmount(@AppointmentId);
    
    UPDATE Billings
    SET 
        PaymentAmount = @ServicePrice,
        DiscountAmount = @DiscountAmount
    WHERE Id = @BillingId;
    
    COMMIT;
    
    SET @Result = N'OK - Giá: ' + CAST(@ServicePrice AS NVARCHAR(20));
END
GO

-- Test
DECLARE @Result NVARCHAR(500);
EXEC sp_UpdateBillingAmount @AppointmentId = 10014, @Result = @Result OUTPUT;
PRINT @Result;


-- test transaction

-- CỬA SỔ 1:
BEGIN TRANSACTION;
UPDATE Services SET SelfPrice = 300000 WHERE Id = 5;
PRINT 'Admin đang giữ lock...';
WAITFOR DELAY '00:00:10';
COMMIT;
PRINT 'Admin COMMITTED';

-- CỬA SỔ 2:
DECLARE @Result NVARCHAR(500);
EXEC sp_UpdateBillingAmount @AppointmentId = 10014, @Result = @Result OUTPUT;
PRINT @Result;

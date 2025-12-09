CREATE PROCEDURE GetAvailableTaskItemsForBooking
(
    @date DATE = NULL,
    @departmentId INT = NULL,
    @doctorId UNIQUEIDENTIFIER = NULL
)
    AS
BEGIN
    SET NOCOUNT ON;

SELECT DISTINCT
    t.Id,
    t.Name,
    t.Date,
    t.StartTime,
    t.EndTime,
    t.Description,
    t.TaskStatus,
    t.DepartmentId,
    t.RoomId,
    t.DeletedAt
FROM tasks t
         INNER JOIN task_registrations tr ON t.Id = tr.TaskId
         INNER JOIN slot_times s ON tr.Id = s.TaskRegistrationId
         INNER JOIN Employees e ON tr.EmployeeId = e.Id
         LEFT JOIN Doctors d ON e.Id = d.EmployeeId
WHERE
    t.TaskStatus = 'Opened'
  AND t.Date >= CAST(GETDATE() AS DATE)
  AND t.DeletedAt IS NULL
  AND s.CurrentAppointments < s.MaxAppointments
  -- Lọc theo date
  AND (@date IS NULL OR t.Date = @date)
  -- Lọc theo department
  AND (@departmentId IS NULL OR t.DepartmentId = @departmentId)
  -- Lọc theo doctor
  AND (@doctorId IS NULL OR d.Id = @doctorId)
ORDER BY t.Date, t.StartTime;
END;
GO

-- =============================================
-- Appointment Stored Procedures
-- =============================================

-- Create Appointments table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Appointments' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[Appointments](
        [Id] [int] IDENTITY(1,1) NOT NULL,
        [PatientId] [int] NOT NULL,
        [DoctorId] [int] NOT NULL,
        [AppointmentDate] [datetime2](7) NOT NULL,
        [VisitType] [nvarchar](50) NOT NULL,
        [Notes] [nvarchar](1000) NULL,
        [Diagnosis] [nvarchar](2000) NULL,
        [Status] [nvarchar](50) NOT NULL DEFAULT 'Scheduled',
        [CreatedBy] [nvarchar](100) NULL,
        [UpdatedBy] [nvarchar](100) NULL,
        [CreatedDate] [datetime2](7) NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedDate] [datetime2](7) NULL,
        CONSTRAINT [PK_Appointments] PRIMARY KEY CLUSTERED ([Id] ASC),
        CONSTRAINT [FK_Appointments_Patients] FOREIGN KEY ([PatientId]) REFERENCES [dbo].[Patients] ([Id]),
        CONSTRAINT [FK_Appointments_Doctors] FOREIGN KEY ([DoctorId]) REFERENCES [dbo].[Doctors] ([Id])
    )
END
GO

-- =============================================
-- Get All Appointments with Patient and Doctor Details (with pagination)
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[sp_GetAllAppointments]
    @Skip INT = 0,
    @Take INT = 50
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        a.Id,
        a.PatientId,
        a.DoctorId,
        a.AppointmentDate,
        a.VisitType,
        a.Notes,
        a.Diagnosis,
        a.Status,
        a.CreatedBy,
        a.UpdatedBy,
        a.CreatedDate,
        a.UpdatedDate,
        CONCAT(p.FirstName, ' ', p.LastName) AS PatientName,
        CONCAT(d.FirstName, ' ', d.LastName) AS DoctorName,
        d.Specialization AS DoctorSpecialization
    FROM Appointments a
    INNER JOIN Patients p ON a.PatientId = p.Id
    INNER JOIN Doctors d ON a.DoctorId = d.Id
    ORDER BY a.AppointmentDate DESC
    OFFSET @Skip ROWS
    FETCH NEXT @Take ROWS ONLY;
END
GO

-- =============================================
-- Get Appointment by ID with Patient and Doctor Details
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[sp_GetAppointmentById]
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        a.Id,
        a.PatientId,
        a.DoctorId,
        a.AppointmentDate,
        a.VisitType,
        a.Notes,
        a.Diagnosis,
        a.Status,
        a.CreatedBy,
        a.UpdatedBy,
        a.CreatedDate,
        a.UpdatedDate,
        CONCAT(p.FirstName, ' ', p.LastName) AS PatientName,
        CONCAT(d.FirstName, ' ', d.LastName) AS DoctorName,
        d.Specialization AS DoctorSpecialization
    FROM Appointments a
    INNER JOIN Patients p ON a.PatientId = p.Id
    INNER JOIN Doctors d ON a.DoctorId = d.Id
    WHERE a.Id = @Id;
END
GO

-- =============================================
-- Create New Appointment
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[sp_CreateAppointment]
    @PatientId INT,
    @DoctorId INT,
    @AppointmentDate DATETIME2,
    @VisitType NVARCHAR(50),
    @Notes NVARCHAR(1000) = NULL,
    @Diagnosis NVARCHAR(2000) = NULL,
    @CreatedBy NVARCHAR(100) = NULL,
    @Id INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Check if patient exists
        IF NOT EXISTS (SELECT 1 FROM Patients WHERE Id = @PatientId)
        BEGIN
            RAISERROR('Patient not found', 16, 1);
            RETURN;
        END
        
        -- Check if doctor exists
        IF NOT EXISTS (SELECT 1 FROM Doctors WHERE Id = @DoctorId)
        BEGIN
            RAISERROR('Doctor not found', 16, 1);
            RETURN;
        END
        
        -- Check if doctor is available
        IF NOT EXISTS (SELECT 1 FROM Doctors WHERE Id = @DoctorId AND IsAvailable = 1 AND IsActive = 1)
        BEGIN
            RAISERROR('Doctor is not available', 16, 1);
            RETURN;
        END
        
        -- Check for time slot conflicts
        IF EXISTS (
            SELECT 1 FROM Appointments 
            WHERE DoctorId = @DoctorId 
            AND AppointmentDate = @AppointmentDate 
            AND Status IN ('Scheduled', 'Confirmed')
        )
        BEGIN
            RAISERROR('Time slot is not available', 16, 1);
            RETURN;
        END
        
        INSERT INTO Appointments (
            PatientId, DoctorId, AppointmentDate, VisitType, 
            Notes, Diagnosis, CreatedBy, CreatedDate
        )
        VALUES (
            @PatientId, @DoctorId, @AppointmentDate, @VisitType,
            @Notes, @Diagnosis, @CreatedBy, GETUTCDATE()
        );
        
        SET @Id = SCOPE_IDENTITY();
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- =============================================
-- Update Appointment
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[sp_UpdateAppointment]
    @Id INT,
    @PatientId INT,
    @DoctorId INT,
    @AppointmentDate DATETIME2,
    @VisitType NVARCHAR(50),
    @Notes NVARCHAR(1000) = NULL,
    @Diagnosis NVARCHAR(2000) = NULL,
    @Status NVARCHAR(50),
    @UpdatedBy NVARCHAR(100) = NULL,
    @UpdatedDate DATETIME2
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Check if appointment exists
        IF NOT EXISTS (SELECT 1 FROM Appointments WHERE Id = @Id)
        BEGIN
            RAISERROR('Appointment not found', 16, 1);
            RETURN;
        END
        
        -- Check if patient exists
        IF NOT EXISTS (SELECT 1 FROM Patients WHERE Id = @PatientId)
        BEGIN
            RAISERROR('Patient not found', 16, 1);
            RETURN;
        END
        
        -- Check if doctor exists
        IF NOT EXISTS (SELECT 1 FROM Doctors WHERE Id = @DoctorId)
        BEGIN
            RAISERROR('Doctor not found', 16, 1);
            RETURN;
        END
        
        -- Check for time slot conflicts (excluding current appointment)
        IF EXISTS (
            SELECT 1 FROM Appointments 
            WHERE DoctorId = @DoctorId 
            AND AppointmentDate = @AppointmentDate 
            AND Status IN ('Scheduled', 'Confirmed')
            AND Id != @Id
        )
        BEGIN
            RAISERROR('Time slot is not available', 16, 1);
            RETURN;
        END
        
        UPDATE Appointments
        SET 
            PatientId = @PatientId,
            DoctorId = @DoctorId,
            AppointmentDate = @AppointmentDate,
            VisitType = @VisitType,
            Notes = @Notes,
            Diagnosis = @Diagnosis,
            Status = @Status,
            UpdatedBy = @UpdatedBy,
            UpdatedDate = @UpdatedDate
        WHERE Id = @Id;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- =============================================
-- Delete Appointment
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[sp_DeleteAppointment]
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM Appointments WHERE Id = @Id;
END
GO

-- =============================================
-- Check if Appointment Exists
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[sp_AppointmentExists]
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT CASE WHEN EXISTS (SELECT 1 FROM Appointments WHERE Id = @Id) THEN 1 ELSE 0 END;
END
GO

-- =============================================
-- Get Appointments by Patient ID
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[sp_GetAppointmentsByPatientId]
    @PatientId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        a.Id,
        a.PatientId,
        a.DoctorId,
        a.AppointmentDate,
        a.VisitType,
        a.Notes,
        a.Diagnosis,
        a.Status,
        a.CreatedBy,
        a.UpdatedBy,
        a.CreatedDate,
        a.UpdatedDate,
        CONCAT(p.FirstName, ' ', p.LastName) AS PatientName,
        CONCAT(d.FirstName, ' ', d.LastName) AS DoctorName,
        d.Specialization AS DoctorSpecialization
    FROM Appointments a
    INNER JOIN Patients p ON a.PatientId = p.Id
    INNER JOIN Doctors d ON a.DoctorId = d.Id
    WHERE a.PatientId = @PatientId
    ORDER BY a.AppointmentDate DESC;
END
GO

-- =============================================
-- Get Appointments by Doctor ID
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[sp_GetAppointmentsByDoctorId]
    @DoctorId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        a.Id,
        a.PatientId,
        a.DoctorId,
        a.AppointmentDate,
        a.VisitType,
        a.Notes,
        a.Diagnosis,
        a.Status,
        a.CreatedBy,
        a.UpdatedBy,
        a.CreatedDate,
        a.UpdatedDate,
        CONCAT(p.FirstName, ' ', p.LastName) AS PatientName,
        CONCAT(d.FirstName, ' ', d.LastName) AS DoctorName,
        d.Specialization AS DoctorSpecialization
    FROM Appointments a
    INNER JOIN Patients p ON a.PatientId = p.Id
    INNER JOIN Doctors d ON a.DoctorId = d.Id
    WHERE a.DoctorId = @DoctorId
    ORDER BY a.AppointmentDate DESC;
END
GO

-- =============================================
-- Get Appointments by Date
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[sp_GetAppointmentsByDate]
    @Date DATE
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        a.Id,
        a.PatientId,
        a.DoctorId,
        a.AppointmentDate,
        a.VisitType,
        a.Notes,
        a.Diagnosis,
        a.Status,
        a.CreatedBy,
        a.UpdatedBy,
        a.CreatedDate,
        a.UpdatedDate,
        CONCAT(p.FirstName, ' ', p.LastName) AS PatientName,
        CONCAT(d.FirstName, ' ', d.LastName) AS DoctorName,
        d.Specialization AS DoctorSpecialization
    FROM Appointments a
    INNER JOIN Patients p ON a.PatientId = p.Id
    INNER JOIN Doctors d ON a.DoctorId = d.Id
    WHERE CAST(a.AppointmentDate AS DATE) = @Date
    ORDER BY a.AppointmentDate ASC;
END
GO

-- =============================================
-- Get Appointments by Date Range
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[sp_GetAppointmentsByDateRange]
    @StartDate DATE,
    @EndDate DATE
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        a.Id,
        a.PatientId,
        a.DoctorId,
        a.AppointmentDate,
        a.VisitType,
        a.Notes,
        a.Diagnosis,
        a.Status,
        a.CreatedBy,
        a.UpdatedBy,
        a.CreatedDate,
        a.UpdatedDate,
        CONCAT(p.FirstName, ' ', p.LastName) AS PatientName,
        CONCAT(d.FirstName, ' ', d.LastName) AS DoctorName,
        d.Specialization AS DoctorSpecialization
    FROM Appointments a
    INNER JOIN Patients p ON a.PatientId = p.Id
    INNER JOIN Doctors d ON a.DoctorId = d.Id
    WHERE CAST(a.AppointmentDate AS DATE) BETWEEN @StartDate AND @EndDate
    ORDER BY a.AppointmentDate ASC;
END
GO

-- =============================================
-- Get Appointments by Status
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[sp_GetAppointmentsByStatus]
    @Status NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        a.Id,
        a.PatientId,
        a.DoctorId,
        a.AppointmentDate,
        a.VisitType,
        a.Notes,
        a.Diagnosis,
        a.Status,
        a.CreatedBy,
        a.UpdatedBy,
        a.CreatedDate,
        a.UpdatedDate,
        CONCAT(p.FirstName, ' ', p.LastName) AS PatientName,
        CONCAT(d.FirstName, ' ', d.LastName) AS DoctorName,
        d.Specialization AS DoctorSpecialization
    FROM Appointments a
    INNER JOIN Patients p ON a.PatientId = p.Id
    INNER JOIN Doctors d ON a.DoctorId = d.Id
    WHERE a.Status = @Status
    ORDER BY a.AppointmentDate DESC;
END
GO

-- =============================================
-- Get Upcoming Appointments
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[sp_GetUpcomingAppointments]
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        a.Id,
        a.PatientId,
        a.DoctorId,
        a.AppointmentDate,
        a.VisitType,
        a.Notes,
        a.Diagnosis,
        a.Status,
        a.CreatedBy,
        a.UpdatedBy,
        a.CreatedDate,
        a.UpdatedDate,
        CONCAT(p.FirstName, ' ', p.LastName) AS PatientName,
        CONCAT(d.FirstName, ' ', d.LastName) AS DoctorName,
        d.Specialization AS DoctorSpecialization
    FROM Appointments a
    INNER JOIN Patients p ON a.PatientId = p.Id
    INNER JOIN Doctors d ON a.DoctorId = d.Id
    WHERE a.AppointmentDate >= GETUTCDATE()
    AND a.Status IN ('Scheduled', 'Confirmed')
    ORDER BY a.AppointmentDate ASC;
END
GO

-- =============================================
-- Get Today's Appointments
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[sp_GetTodaysAppointments]
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        a.Id,
        a.PatientId,
        a.DoctorId,
        a.AppointmentDate,
        a.VisitType,
        a.Notes,
        a.Diagnosis,
        a.Status,
        a.CreatedBy,
        a.UpdatedBy,
        a.CreatedDate,
        a.UpdatedDate,
        CONCAT(p.FirstName, ' ', p.LastName) AS PatientName,
        CONCAT(d.FirstName, ' ', d.LastName) AS DoctorName,
        d.Specialization AS DoctorSpecialization
    FROM Appointments a
    INNER JOIN Patients p ON a.PatientId = p.Id
    INNER JOIN Doctors d ON a.DoctorId = d.Id
    WHERE CAST(a.AppointmentDate AS DATE) = CAST(GETUTCDATE() AS DATE)
    ORDER BY a.AppointmentDate ASC;
END
GO

-- =============================================
-- Search Appointments
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[sp_SearchAppointments]
    @SearchTerm NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        a.Id,
        a.PatientId,
        a.DoctorId,
        a.AppointmentDate,
        a.VisitType,
        a.Notes,
        a.Diagnosis,
        a.Status,
        a.CreatedBy,
        a.UpdatedBy,
        a.CreatedDate,
        a.UpdatedDate,
        CONCAT(p.FirstName, ' ', p.LastName) AS PatientName,
        CONCAT(d.FirstName, ' ', d.LastName) AS DoctorName,
        d.Specialization AS DoctorSpecialization
    FROM Appointments a
    INNER JOIN Patients p ON a.PatientId = p.Id
    INNER JOIN Doctors d ON a.DoctorId = d.Id
    WHERE 
        CONCAT(p.FirstName, ' ', p.LastName) LIKE '%' + @SearchTerm + '%'
        OR CONCAT(d.FirstName, ' ', d.LastName) LIKE '%' + @SearchTerm + '%'
        OR d.Specialization LIKE '%' + @SearchTerm + '%'
        OR a.VisitType LIKE '%' + @SearchTerm + '%'
        OR a.Status LIKE '%' + @SearchTerm + '%'
        OR a.Notes LIKE '%' + @SearchTerm + '%'
        OR a.Diagnosis LIKE '%' + @SearchTerm + '%'
    ORDER BY a.AppointmentDate DESC;
END
GO

-- =============================================
-- Get Appointments by Visit Type
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[sp_GetAppointmentsByVisitType]
    @VisitType NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        a.Id,
        a.PatientId,
        a.DoctorId,
        a.AppointmentDate,
        a.VisitType,
        a.Notes,
        a.Diagnosis,
        a.Status,
        a.CreatedBy,
        a.UpdatedBy,
        a.CreatedDate,
        a.UpdatedDate,
        CONCAT(p.FirstName, ' ', p.LastName) AS PatientName,
        CONCAT(d.FirstName, ' ', d.LastName) AS DoctorName,
        d.Specialization AS DoctorSpecialization
    FROM Appointments a
    INNER JOIN Patients p ON a.PatientId = p.Id
    INNER JOIN Doctors d ON a.DoctorId = d.Id
    WHERE a.VisitType = @VisitType
    ORDER BY a.AppointmentDate DESC;
END
GO

-- =============================================
-- Update Appointment Status
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[sp_UpdateAppointmentStatus]
    @Id INT,
    @Status NVARCHAR(50),
    @UpdatedDate DATETIME2
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Appointments
    SET 
        Status = @Status,
        UpdatedDate = @UpdatedDate
    WHERE Id = @Id;
END
GO

-- =============================================
-- Check if Doctor is Available
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[sp_IsDoctorAvailable]
    @DoctorId INT,
    @AppointmentDate DATETIME2
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT CASE WHEN EXISTS (
        SELECT 1 FROM Doctors 
        WHERE Id = @DoctorId 
        AND IsAvailable = 1 
        AND IsActive = 1
    ) THEN 1 ELSE 0 END;
END
GO

-- =============================================
-- Check if Time Slot is Available
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[sp_IsTimeSlotAvailable]
    @DoctorId INT,
    @AppointmentDate DATETIME2
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT CASE WHEN NOT EXISTS (
        SELECT 1 FROM Appointments 
        WHERE DoctorId = @DoctorId 
        AND AppointmentDate = @AppointmentDate 
        AND Status IN ('Scheduled', 'Confirmed')
    ) THEN 1 ELSE 0 END;
END
GO

-- =============================================
-- Get Available Time Slots for a Doctor on a Date
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[sp_GetAvailableTimeSlots]
    @DoctorId INT,
    @Date DATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- This is a simplified version that returns hourly slots from 9 AM to 5 PM
    -- In a real application, you would consider doctor's working hours and existing appointments
    WITH TimeSlots AS (
        SELECT DATETIMEFROMPARTS(YEAR(@Date), MONTH(@Date), DAY(@Date), 9, 0, 0, 0) AS TimeSlot
        UNION ALL
        SELECT DATETIMEFROMPARTS(YEAR(@Date), MONTH(@Date), DAY(@Date), 10, 0, 0, 0)
        UNION ALL
        SELECT DATETIMEFROMPARTS(YEAR(@Date), MONTH(@Date), DAY(@Date), 11, 0, 0, 0)
        UNION ALL
        SELECT DATETIMEFROMPARTS(YEAR(@Date), MONTH(@Date), DAY(@Date), 12, 0, 0, 0)
        UNION ALL
        SELECT DATETIMEFROMPARTS(YEAR(@Date), MONTH(@Date), DAY(@Date), 13, 0, 0, 0)
        UNION ALL
        SELECT DATETIMEFROMPARTS(YEAR(@Date), MONTH(@Date), DAY(@Date), 14, 0, 0, 0)
        UNION ALL
        SELECT DATETIMEFROMPARTS(YEAR(@Date), MONTH(@Date), DAY(@Date), 15, 0, 0, 0)
        UNION ALL
        SELECT DATETIMEFROMPARTS(YEAR(@Date), MONTH(@Date), DAY(@Date), 16, 0, 0, 0)
        UNION ALL
        SELECT DATETIMEFROMPARTS(YEAR(@Date), MONTH(@Date), DAY(@Date), 17, 0, 0, 0)
    )
    SELECT ts.TimeSlot
    FROM TimeSlots ts
    WHERE NOT EXISTS (
        SELECT 1 FROM Appointments 
        WHERE DoctorId = @DoctorId 
        AND AppointmentDate = ts.TimeSlot 
        AND Status IN ('Scheduled', 'Confirmed')
    )
    AND ts.TimeSlot > GETUTCDATE()
    ORDER BY ts.TimeSlot;
END
GO

-- =============================================
-- Count Stored Procedures for Pagination
-- =============================================

-- Get Appointments Count
CREATE OR ALTER PROCEDURE [dbo].[sp_GetAppointmentsCount]
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT COUNT(*) FROM Appointments;
END
GO

-- Get Appointments by Patient ID Count
CREATE OR ALTER PROCEDURE [dbo].[sp_GetAppointmentsByPatientIdCount]
    @PatientId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT COUNT(*) 
    FROM Appointments 
    WHERE PatientId = @PatientId;
END
GO

-- Get Appointments by Doctor ID Count
CREATE OR ALTER PROCEDURE [dbo].[sp_GetAppointmentsByDoctorIdCount]
    @DoctorId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT COUNT(*) 
    FROM Appointments 
    WHERE DoctorId = @DoctorId;
END
GO

-- Get Appointments by Date Count
CREATE OR ALTER PROCEDURE [dbo].[sp_GetAppointmentsByDateCount]
    @Date DATE
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT COUNT(*) 
    FROM Appointments 
    WHERE CAST(AppointmentDate AS DATE) = @Date;
END
GO

-- Get Appointments by Date Range Count
CREATE OR ALTER PROCEDURE [dbo].[sp_GetAppointmentsByDateRangeCount]
    @StartDate DATE,
    @EndDate DATE
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT COUNT(*) 
    FROM Appointments 
    WHERE CAST(AppointmentDate AS DATE) BETWEEN @StartDate AND @EndDate;
END
GO

-- Get Appointments by Status Count
CREATE OR ALTER PROCEDURE [dbo].[sp_GetAppointmentsByStatusCount]
    @Status NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT COUNT(*) 
    FROM Appointments 
    WHERE Status = @Status;
END
GO

-- Get Upcoming Appointments Count
CREATE OR ALTER PROCEDURE [dbo].[sp_GetUpcomingAppointmentsCount]
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT COUNT(*) 
    FROM Appointments 
    WHERE AppointmentDate >= GETUTCDATE()
    AND Status IN ('Scheduled', 'Confirmed');
END
GO

-- Get Today's Appointments Count
CREATE OR ALTER PROCEDURE [dbo].[sp_GetTodaysAppointmentsCount]
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT COUNT(*) 
    FROM Appointments 
    WHERE CAST(AppointmentDate AS DATE) = CAST(GETUTCDATE() AS DATE);
END
GO

-- Search Appointments Count
CREATE OR ALTER PROCEDURE [dbo].[sp_SearchAppointmentsCount]
    @SearchTerm NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT COUNT(*) 
    FROM Appointments a
    INNER JOIN Patients p ON a.PatientId = p.Id
    INNER JOIN Doctors d ON a.DoctorId = d.Id
    WHERE 
        CONCAT(p.FirstName, ' ', p.LastName) LIKE '%' + @SearchTerm + '%'
        OR CONCAT(d.FirstName, ' ', d.LastName) LIKE '%' + @SearchTerm + '%'
        OR d.Specialization LIKE '%' + @SearchTerm + '%'
        OR a.VisitType LIKE '%' + @SearchTerm + '%'
        OR a.Status LIKE '%' + @SearchTerm + '%'
        OR a.Notes LIKE '%' + @SearchTerm + '%'
        OR a.Diagnosis LIKE '%' + @SearchTerm + '%';
END
GO

-- Get Appointments by Visit Type Count
CREATE OR ALTER PROCEDURE [dbo].[sp_GetAppointmentsByVisitTypeCount]
    @VisitType NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT COUNT(*) 
    FROM Appointments 
    WHERE VisitType = @VisitType;
END
GO

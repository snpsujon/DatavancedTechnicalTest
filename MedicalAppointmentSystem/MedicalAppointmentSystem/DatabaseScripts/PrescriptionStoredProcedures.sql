-- =============================================
-- Prescription and Medicine Stored Procedures
-- =============================================

-- Create Medicines table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Medicines' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[Medicines](
        [Id] [int] IDENTITY(1,1) NOT NULL,
        [Name] [nvarchar](200) NOT NULL,
        [GenericName] [nvarchar](100) NULL,
        [DosageForm] [nvarchar](50) NULL,
        [Strength] [nvarchar](20) NULL,
        [Manufacturer] [nvarchar](100) NULL,
        [Description] [nvarchar](500) NULL,
        [Indications] [nvarchar](1000) NULL,
        [Contraindications] [nvarchar](1000) NULL,
        [SideEffects] [nvarchar](1000) NULL,
        [Instructions] [nvarchar](1000) NULL,
        [IsActive] [bit] NOT NULL DEFAULT 1,
        [CreatedDate] [datetime2](7) NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedDate] [datetime2](7) NULL,
        [CreatedBy] [nvarchar](100) NULL,
        [UpdatedBy] [nvarchar](100) NULL,
        CONSTRAINT [PK_Medicines] PRIMARY KEY CLUSTERED ([Id] ASC)
    )
END
GO

-- Create Prescriptions table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Prescriptions' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[Prescriptions](
        [Id] [int] IDENTITY(1,1) NOT NULL,
        [AppointmentId] [int] NOT NULL,
        [GeneralNotes] [nvarchar](1000) NULL,
        [FollowUpInstructions] [nvarchar](1000) NULL,
        [PrescriptionDate] [datetime2](7) NOT NULL DEFAULT GETUTCDATE(),
        [IsActive] [bit] NOT NULL DEFAULT 1,
        [CreatedBy] [nvarchar](100) NULL,
        [UpdatedBy] [nvarchar](100) NULL,
        [CreatedDate] [datetime2](7) NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedDate] [datetime2](7) NULL,
        CONSTRAINT [PK_Prescriptions] PRIMARY KEY CLUSTERED ([Id] ASC),
        CONSTRAINT [FK_Prescriptions_Appointments] FOREIGN KEY ([AppointmentId]) REFERENCES [dbo].[Appointments] ([Id])
    )
END
ELSE
BEGIN
    -- Add IsActive column if it doesn't exist
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Prescriptions') AND name = 'IsActive')
    BEGIN
        ALTER TABLE [dbo].[Prescriptions] ADD [IsActive] [bit] NOT NULL DEFAULT 1;
    END
END
GO

-- Create PrescriptionDetails table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='PrescriptionDetails' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[PrescriptionDetails](
        [Id] [int] IDENTITY(1,1) NOT NULL,
        [PrescriptionId] [int] NOT NULL,
        [MedicineId] [int] NOT NULL,
        [Dosage] [nvarchar](200) NOT NULL,
        [StartDate] [datetime2](7) NOT NULL,
        [EndDate] [datetime2](7) NOT NULL,
        [Notes] [nvarchar](1000) NULL,
        [IsActive] [bit] NOT NULL DEFAULT 1,
        [CreatedBy] [nvarchar](100) NULL,
        [UpdatedBy] [nvarchar](100) NULL,
        [CreatedDate] [datetime2](7) NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedDate] [datetime2](7) NULL,
        CONSTRAINT [PK_PrescriptionDetails] PRIMARY KEY CLUSTERED ([Id] ASC),
        CONSTRAINT [FK_PrescriptionDetails_Prescriptions] FOREIGN KEY ([PrescriptionId]) REFERENCES [dbo].[Prescriptions] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_PrescriptionDetails_Medicines] FOREIGN KEY ([MedicineId]) REFERENCES [dbo].[Medicines] ([Id])
    )
END
ELSE
BEGIN
    -- Add IsActive column if it doesn't exist
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('PrescriptionDetails') AND name = 'IsActive')
    BEGIN
        ALTER TABLE [dbo].[PrescriptionDetails] ADD [IsActive] [bit] NOT NULL DEFAULT 1;
    END
END
GO

-- =============================================
-- Medicine Stored Procedures
-- =============================================

-- Get All Medicines
CREATE OR ALTER PROCEDURE [dbo].[sp_GetAllMedicines]
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        Name,
        GenericName,
        DosageForm,
        Strength,
        Manufacturer,
        Description,
        Indications,
        Contraindications,
        SideEffects,
        Instructions
    FROM Medicines
    ORDER BY Name;
END
GO

-- Get Medicine by ID
CREATE OR ALTER PROCEDURE [dbo].[sp_GetMedicineById]
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        Name,
        GenericName,
        DosageForm,
        Strength,
        Manufacturer,
        Description,
        Indications,
        Contraindications,
        SideEffects,
        Instructions
    FROM Medicines
    WHERE Id = @Id;
END
GO

-- Create Medicine
CREATE OR ALTER PROCEDURE [dbo].[sp_CreateMedicine]
    @Name NVARCHAR(200),
    @GenericName NVARCHAR(100) = NULL,
    @DosageForm NVARCHAR(50) = NULL,
    @Strength NVARCHAR(20) = NULL,
    @Manufacturer NVARCHAR(100) = NULL,
    @Description NVARCHAR(500) = NULL,
    @Indications NVARCHAR(1000) = NULL,
    @Contraindications NVARCHAR(1000) = NULL,
    @SideEffects NVARCHAR(1000) = NULL,
    @Instructions NVARCHAR(1000) = NULL,
    @IsActive BIT = 1,
    @CreatedBy NVARCHAR(100) = NULL,
    @Id INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Medicines (
        Name, GenericName, DosageForm, Strength, Manufacturer, 
        Description, Indications, Contraindications, SideEffects, 
        Instructions, IsActive, CreatedBy, CreatedDate
    )
    VALUES (
        @Name, @GenericName, @DosageForm, @Strength, @Manufacturer,
        @Description, @Indications, @Contraindications, @SideEffects,
        @Instructions, @IsActive, @CreatedBy, GETUTCDATE()
    );
    
    SET @Id = SCOPE_IDENTITY();
END
GO

-- Update Medicine
CREATE OR ALTER PROCEDURE [dbo].[sp_UpdateMedicine]
    @Id INT,
    @Name NVARCHAR(200),
    @GenericName NVARCHAR(100) = NULL,
    @DosageForm NVARCHAR(50) = NULL,
    @Strength NVARCHAR(20) = NULL,
    @Manufacturer NVARCHAR(100) = NULL,
    @Description NVARCHAR(500) = NULL,
    @Indications NVARCHAR(1000) = NULL,
    @Contraindications NVARCHAR(1000) = NULL,
    @SideEffects NVARCHAR(1000) = NULL,
    @Instructions NVARCHAR(1000) = NULL,
    @IsActive BIT = 1,
    @UpdatedBy NVARCHAR(100) = NULL,
    @UpdatedDate DATETIME2
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Medicines
    SET 
        Name = @Name,
        GenericName = @GenericName,
        DosageForm = @DosageForm,
        Strength = @Strength,
        Manufacturer = @Manufacturer,
        Description = @Description,
        Indications = @Indications,
        Contraindications = @Contraindications,
        SideEffects = @SideEffects,
        Instructions = @Instructions,
        IsActive = @IsActive,
        UpdatedBy = @UpdatedBy,
        UpdatedDate = @UpdatedDate
    WHERE Id = @Id;
END
GO

-- Delete Medicine
CREATE OR ALTER PROCEDURE [dbo].[sp_DeleteMedicine]
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM Medicines WHERE Id = @Id;
END
GO

-- Check if Medicine Exists
CREATE OR ALTER PROCEDURE [dbo].[sp_MedicineExists]
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT CASE WHEN EXISTS (SELECT 1 FROM Medicines WHERE Id = @Id) THEN 1 ELSE 0 END;
END
GO

-- Get Active Medicines
CREATE OR ALTER PROCEDURE [dbo].[sp_GetActiveMedicines]
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        Name,
        GenericName,
        DosageForm,
        Strength,
        Manufacturer,
        Description,
        Indications,
        Contraindications,
        SideEffects,
        Instructions
    FROM Medicines
    WHERE IsActive = 1
    ORDER BY Name;
END
GO

-- Search Medicines
CREATE OR ALTER PROCEDURE [dbo].[sp_SearchMedicines]
    @SearchTerm NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        Name,
        GenericName,
        DosageForm,
        Strength,
        Manufacturer,
        Description,
        Indications,
        Contraindications,
        SideEffects,
        Instructions
    FROM Medicines
    WHERE 
        Name LIKE '%' + @SearchTerm + '%'
        OR GenericName LIKE '%' + @SearchTerm + '%'
        OR Manufacturer LIKE '%' + @SearchTerm + '%'
        OR DosageForm LIKE '%' + @SearchTerm + '%'
    ORDER BY Name;
END
GO

-- Get Medicines by Manufacturer
CREATE OR ALTER PROCEDURE [dbo].[sp_GetMedicinesByManufacturer]
    @Manufacturer NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        Name,
        GenericName,
        DosageForm,
        Strength,
        Manufacturer,
        Description,
        Indications,
        Contraindications,
        SideEffects,
        Instructions
    FROM Medicines
    WHERE Manufacturer = @Manufacturer
    ORDER BY Name;
END
GO

-- Get Medicines by Dosage Form
CREATE OR ALTER PROCEDURE [dbo].[sp_GetMedicinesByDosageForm]
    @DosageForm NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        Name,
        GenericName,
        DosageForm,
        Strength,
        Manufacturer,
        Description,
        Indications,
        Contraindications,
        SideEffects,
        Instructions
    FROM Medicines
    WHERE DosageForm = @DosageForm
    ORDER BY Name;
END
GO

-- =============================================
-- Prescription Stored Procedures
-- =============================================

-- Get All Prescriptions (with pagination)
CREATE OR ALTER PROCEDURE [dbo].[sp_GetAllPrescriptions]
    @Skip INT = 0,
    @Take INT = 50
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        p.Id,
        p.AppointmentId,
        p.GeneralNotes,
        p.FollowUpInstructions,
        p.PrescriptionDate,
        p.CreatedBy,
        p.UpdatedBy,
        p.CreatedDate,
        p.UpdatedDate,
        CONCAT(pat.FirstName, ' ', pat.LastName) AS PatientName,
        CONCAT(d.FirstName, ' ', d.LastName) AS DoctorName,
        FORMAT(a.AppointmentDate, 'yyyy-MM-dd') AS AppointmentDate,
        a.VisitType
    FROM Prescriptions p
    INNER JOIN Appointments a ON p.AppointmentId = a.Id
    INNER JOIN Patients pat ON a.PatientId = pat.Id
    INNER JOIN Doctors d ON a.DoctorId = d.Id
    WHERE p.IsActive = 1
    ORDER BY p.PrescriptionDate DESC
    OFFSET @Skip ROWS
    FETCH NEXT @Take ROWS ONLY;
END
GO

-- Get Prescription by ID
CREATE OR ALTER PROCEDURE [dbo].[sp_GetPrescriptionById]
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        p.Id,
        p.AppointmentId,
        p.GeneralNotes,
        p.FollowUpInstructions,
        p.PrescriptionDate,
        p.CreatedBy,
        p.UpdatedBy,
        p.CreatedDate,
        p.UpdatedDate,
        CONCAT(pat.FirstName, ' ', pat.LastName) AS PatientName,
        CONCAT(d.FirstName, ' ', d.LastName) AS DoctorName,
        FORMAT(a.AppointmentDate, 'yyyy-MM-dd') AS AppointmentDate,
        a.VisitType
    FROM Prescriptions p
    INNER JOIN Appointments a ON p.AppointmentId = a.Id
    INNER JOIN Patients pat ON a.PatientId = pat.Id
    INNER JOIN Doctors d ON a.DoctorId = d.Id
    WHERE p.Id = @Id AND p.IsActive = 1;
END
GO

-- Create Prescription
CREATE OR ALTER PROCEDURE [dbo].[sp_CreatePrescription]
    @AppointmentId INT,
    @GeneralNotes NVARCHAR(1000) = NULL,
    @FollowUpInstructions NVARCHAR(1000) = NULL,
    @CreatedBy NVARCHAR(100) = NULL,
    @Id INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Check if appointment exists
        IF NOT EXISTS (SELECT 1 FROM Appointments WHERE Id = @AppointmentId)
        BEGIN
            RAISERROR('Appointment not found', 16, 1);
            RETURN;
        END
        
        INSERT INTO Prescriptions (
            AppointmentId, GeneralNotes, FollowUpInstructions, 
            IsActive, CreatedBy, CreatedDate
        )
        VALUES (
            @AppointmentId, @GeneralNotes, @FollowUpInstructions,
            1, @CreatedBy, GETUTCDATE()
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

-- Update Prescription
CREATE OR ALTER PROCEDURE [dbo].[sp_UpdatePrescription]
    @Id INT,
    @AppointmentId INT,
    @GeneralNotes NVARCHAR(1000) = NULL,
    @FollowUpInstructions NVARCHAR(1000) = NULL,
    @UpdatedBy NVARCHAR(100) = NULL,
    @UpdatedDate DATETIME2
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Prescriptions
    SET 
        AppointmentId = @AppointmentId,
        GeneralNotes = @GeneralNotes,
        FollowUpInstructions = @FollowUpInstructions,
        UpdatedBy = @UpdatedBy,
        UpdatedDate = @UpdatedDate
    WHERE Id = @Id;
END
GO

-- Delete Prescription (Soft Delete)
CREATE OR ALTER PROCEDURE [dbo].[sp_DeletePrescription]
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Soft delete prescription
        UPDATE Prescriptions 
        SET IsActive = 0, UpdatedDate = GETUTCDATE()
        WHERE Id = @Id;
        
        -- Soft delete all prescription details
        UPDATE PrescriptionDetails 
        SET IsActive = 0, UpdatedDate = GETUTCDATE()
        WHERE PrescriptionId = @Id;
        
        IF @@ROWCOUNT = 0
            THROW 50001, 'Prescription not found', 1;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- Check if Prescription Exists
CREATE OR ALTER PROCEDURE [dbo].[sp_PrescriptionExists]
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT CASE WHEN EXISTS (SELECT 1 FROM Prescriptions WHERE Id = @Id AND IsActive = 1) THEN 1 ELSE 0 END;
END
GO

-- Get Prescription by Appointment ID
CREATE OR ALTER PROCEDURE [dbo].[sp_GetPrescriptionByAppointmentId]
    @AppointmentId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        p.Id,
        p.AppointmentId,
        p.GeneralNotes,
        p.FollowUpInstructions,
        p.PrescriptionDate,
        p.CreatedBy,
        p.UpdatedBy,
        p.CreatedDate,
        p.UpdatedDate,
        CONCAT(pat.FirstName, ' ', pat.LastName) AS PatientName,
        CONCAT(d.FirstName, ' ', d.LastName) AS DoctorName,
        FORMAT(a.AppointmentDate, 'yyyy-MM-dd') AS AppointmentDate,
        a.VisitType
    FROM Prescriptions p
    INNER JOIN Appointments a ON p.AppointmentId = a.Id
    INNER JOIN Patients pat ON a.PatientId = pat.Id
    INNER JOIN Doctors d ON a.DoctorId = d.Id
    WHERE p.AppointmentId = @AppointmentId AND p.IsActive = 1;
END
GO

-- =============================================
-- Prescription Detail Stored Procedures
-- =============================================

-- Get Prescription Details by Prescription ID
CREATE OR ALTER PROCEDURE [dbo].[sp_GetPrescriptionDetailsByPrescriptionId]
    @PrescriptionId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        pd.Id,
        pd.PrescriptionId,
        pd.MedicineId,
        pd.Dosage,
        pd.StartDate,
        pd.EndDate,
        pd.Notes,
        m.Name AS MedicineName,
        m.GenericName AS MedicineGenericName,
        m.DosageForm AS MedicineDosageForm,
        m.Strength AS MedicineStrength,
        m.Manufacturer AS MedicineManufacturer
    FROM PrescriptionDetails pd
    INNER JOIN Medicines m ON pd.MedicineId = m.Id
    WHERE pd.PrescriptionId = @PrescriptionId AND pd.IsActive = 1
    ORDER BY pd.Id;
END
GO

-- Get Prescription Detail by ID
CREATE OR ALTER PROCEDURE [dbo].[sp_GetPrescriptionDetailById]
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        pd.Id,
        pd.PrescriptionId,
        pd.MedicineId,
        pd.Dosage,
        pd.StartDate,
        pd.EndDate,
        pd.Notes,
        m.Name AS MedicineName,
        m.GenericName AS MedicineGenericName,
        m.DosageForm AS MedicineDosageForm,
        m.Strength AS MedicineStrength,
        m.Manufacturer AS MedicineManufacturer
    FROM PrescriptionDetails pd
    INNER JOIN Medicines m ON pd.MedicineId = m.Id
    WHERE pd.Id = @Id AND pd.IsActive = 1;
END
GO

-- Create Prescription Detail
CREATE OR ALTER PROCEDURE [dbo].[sp_CreatePrescriptionDetail]
    @Id INT = 0,  -- Made optional with default value 0 for new records
    @PrescriptionId INT,
    @MedicineId INT,
    @Dosage NVARCHAR(200),
    @StartDate DATETIME2,
    @EndDate DATETIME2,
    @Notes NVARCHAR(1000) = NULL,
    @CreatedBy NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Check if prescription exists
        IF NOT EXISTS (SELECT 1 FROM Prescriptions WHERE Id = @PrescriptionId)
        BEGIN
            RAISERROR('Prescription not found', 16, 1);
            RETURN;
        END
        
        -- Check if medicine exists
        IF NOT EXISTS (SELECT 1 FROM Medicines WHERE Id = @MedicineId)
        BEGIN
            RAISERROR('Medicine not found', 16, 1);
            RETURN;
        END
        
        -- Validate dates
        IF @StartDate > @EndDate
        BEGIN
            RAISERROR('Start date cannot be after end date', 16, 1);
            RETURN;
        END
        
        INSERT INTO PrescriptionDetails (
            PrescriptionId, MedicineId, Dosage, StartDate, EndDate, 
            Notes, IsActive, CreatedBy, CreatedDate
        )
        VALUES (
            @PrescriptionId, @MedicineId, @Dosage, @StartDate, @EndDate,
            @Notes, 1, @CreatedBy, GETUTCDATE()
        );
        
        -- Get the newly created prescription detail ID
        SET @Id = SCOPE_IDENTITY();
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- Update Prescription Detail
CREATE OR ALTER PROCEDURE [dbo].[sp_UpdatePrescriptionDetail]
    @Id INT,
    @PrescriptionId INT,
    @MedicineId INT,
    @Dosage NVARCHAR(200),
    @StartDate DATETIME2,
    @EndDate DATETIME2,
    @Notes NVARCHAR(1000) = NULL,
    @UpdatedBy NVARCHAR(100) = NULL,
    @UpdatedDate DATETIME2
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Check if prescription detail exists
        IF NOT EXISTS (SELECT 1 FROM PrescriptionDetails WHERE Id = @Id)
        BEGIN
            RAISERROR('Prescription detail not found', 16, 1);
            RETURN;
        END
        
        -- Check if medicine exists
        IF NOT EXISTS (SELECT 1 FROM Medicines WHERE Id = @MedicineId)
        BEGIN
            RAISERROR('Medicine not found', 16, 1);
            RETURN;
        END
        
        -- Validate dates
        IF @StartDate > @EndDate
        BEGIN
            RAISERROR('Start date cannot be after end date', 16, 1);
            RETURN;
        END
        
        UPDATE PrescriptionDetails
        SET 
            PrescriptionId = @PrescriptionId,
            MedicineId = @MedicineId,
            Dosage = @Dosage,
            StartDate = @StartDate,
            EndDate = @EndDate,
            Notes = @Notes,
            IsActive = 1,
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

-- Delete Prescription Detail (Soft Delete)
CREATE OR ALTER PROCEDURE [dbo].[sp_DeletePrescriptionDetail]
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE PrescriptionDetails 
    SET IsActive = 0, UpdatedDate = GETUTCDATE()
    WHERE Id = @Id;
END
GO

-- =============================================
-- Additional Prescription Stored Procedures
-- =============================================

-- Get Prescriptions by Patient ID
CREATE OR ALTER PROCEDURE [dbo].[sp_GetPrescriptionsByPatientId]
    @PatientId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        p.Id,
        p.AppointmentId,
        p.GeneralNotes,
        p.FollowUpInstructions,
        p.PrescriptionDate,
        p.CreatedBy,
        p.UpdatedBy,
        p.CreatedDate,
        p.UpdatedDate,
        CONCAT(pat.FirstName, ' ', pat.LastName) AS PatientName,
        CONCAT(d.FirstName, ' ', d.LastName) AS DoctorName,
        FORMAT(a.AppointmentDate, 'yyyy-MM-dd') AS AppointmentDate,
        a.VisitType
    FROM Prescriptions p
    INNER JOIN Appointments a ON p.AppointmentId = a.Id
    INNER JOIN Patients pat ON a.PatientId = pat.Id
    INNER JOIN Doctors d ON a.DoctorId = d.Id
    WHERE a.PatientId = @PatientId AND p.IsActive = 1
    ORDER BY p.PrescriptionDate DESC;
END
GO

-- Get Prescriptions by Doctor ID
CREATE OR ALTER PROCEDURE [dbo].[sp_GetPrescriptionsByDoctorId]
    @DoctorId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        p.Id,
        p.AppointmentId,
        p.GeneralNotes,
        p.FollowUpInstructions,
        p.PrescriptionDate,
        p.CreatedBy,
        p.UpdatedBy,
        p.CreatedDate,
        p.UpdatedDate,
        CONCAT(pat.FirstName, ' ', pat.LastName) AS PatientName,
        CONCAT(d.FirstName, ' ', d.LastName) AS DoctorName,
        FORMAT(a.AppointmentDate, 'yyyy-MM-dd') AS AppointmentDate,
        a.VisitType
    FROM Prescriptions p
    INNER JOIN Appointments a ON p.AppointmentId = a.Id
    INNER JOIN Patients pat ON a.PatientId = pat.Id
    INNER JOIN Doctors d ON a.DoctorId = d.Id
    WHERE a.DoctorId = @DoctorId AND p.IsActive = 1
    ORDER BY p.PrescriptionDate DESC;
END
GO

-- Get Prescriptions by Date Range
CREATE OR ALTER PROCEDURE [dbo].[sp_GetPrescriptionsByDateRange]
    @StartDate DATE,
    @EndDate DATE
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        p.Id,
        p.AppointmentId,
        p.GeneralNotes,
        p.FollowUpInstructions,
        p.PrescriptionDate,
        p.CreatedBy,
        p.UpdatedBy,
        p.CreatedDate,
        p.UpdatedDate,
        CONCAT(pat.FirstName, ' ', pat.LastName) AS PatientName,
        CONCAT(d.FirstName, ' ', d.LastName) AS DoctorName,
        FORMAT(a.AppointmentDate, 'yyyy-MM-dd') AS AppointmentDate,
        a.VisitType
    FROM Prescriptions p
    INNER JOIN Appointments a ON p.AppointmentId = a.Id
    INNER JOIN Patients pat ON a.PatientId = pat.Id
    INNER JOIN Doctors d ON a.DoctorId = d.Id
    WHERE CAST(p.PrescriptionDate AS DATE) BETWEEN @StartDate AND @EndDate AND p.IsActive = 1
    ORDER BY p.PrescriptionDate DESC;
END
GO

-- Search Prescriptions
CREATE OR ALTER PROCEDURE [dbo].[sp_SearchPrescriptions]
    @SearchTerm NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        p.Id,
        p.AppointmentId,
        p.GeneralNotes,
        p.FollowUpInstructions,
        p.PrescriptionDate,
        p.CreatedBy,
        p.UpdatedBy,
        p.CreatedDate,
        p.UpdatedDate,
        CONCAT(pat.FirstName, ' ', pat.LastName) AS PatientName,
        CONCAT(d.FirstName, ' ', d.LastName) AS DoctorName,
        FORMAT(a.AppointmentDate, 'yyyy-MM-dd') AS AppointmentDate,
        a.VisitType
    FROM Prescriptions p
    INNER JOIN Appointments a ON p.AppointmentId = a.Id
    INNER JOIN Patients pat ON a.PatientId = pat.Id
    INNER JOIN Doctors d ON a.DoctorId = d.Id
    WHERE p.IsActive = 1 AND (
        CONCAT(pat.FirstName, ' ', pat.LastName) LIKE '%' + @SearchTerm + '%'
        OR CONCAT(d.FirstName, ' ', d.LastName) LIKE '%' + @SearchTerm + '%'
        OR p.GeneralNotes LIKE '%' + @SearchTerm + '%'
        OR p.FollowUpInstructions LIKE '%' + @SearchTerm + '%'
    )
    ORDER BY p.PrescriptionDate DESC;
END
GO

-- =============================================
-- Count Stored Procedures for Pagination
-- =============================================

-- Get Prescriptions Count
CREATE OR ALTER PROCEDURE [dbo].[sp_GetPrescriptionsCount]
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT COUNT(*) FROM Prescriptions WHERE IsActive = 1;
END
GO

-- Get Prescriptions by Patient ID Count
CREATE OR ALTER PROCEDURE [dbo].[sp_GetPrescriptionsByPatientIdCount]
    @PatientId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT COUNT(*) 
    FROM Prescriptions p
    INNER JOIN Appointments a ON p.AppointmentId = a.Id
    WHERE a.PatientId = @PatientId AND p.IsActive = 1;
END
GO

-- Get Prescriptions by Doctor ID Count
CREATE OR ALTER PROCEDURE [dbo].[sp_GetPrescriptionsByDoctorIdCount]
    @DoctorId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT COUNT(*) 
    FROM Prescriptions p
    INNER JOIN Appointments a ON p.AppointmentId = a.Id
    WHERE a.DoctorId = @DoctorId AND p.IsActive = 1;
END
GO

-- Get Prescriptions by Date Range Count
CREATE OR ALTER PROCEDURE [dbo].[sp_GetPrescriptionsByDateRangeCount]
    @StartDate DATE,
    @EndDate DATE
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT COUNT(*) 
    FROM Prescriptions 
    WHERE CAST(PrescriptionDate AS DATE) BETWEEN @StartDate AND @EndDate AND IsActive = 1;
END
GO

-- Search Prescriptions Count
CREATE OR ALTER PROCEDURE [dbo].[sp_SearchPrescriptionsCount]
    @SearchTerm NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT COUNT(*) 
    FROM Prescriptions p
    INNER JOIN Appointments a ON p.AppointmentId = a.Id
    INNER JOIN Patients pat ON a.PatientId = pat.Id
    INNER JOIN Doctors d ON a.DoctorId = d.Id
    WHERE p.IsActive = 1 AND (
        CONCAT(pat.FirstName, ' ', pat.LastName) LIKE '%' + @SearchTerm + '%'
        OR CONCAT(d.FirstName, ' ', d.LastName) LIKE '%' + @SearchTerm + '%'
        OR p.GeneralNotes LIKE '%' + @SearchTerm + '%'
        OR p.FollowUpInstructions LIKE '%' + @SearchTerm + '%'
    );
END
GO

-- =============================================
-- Medicine Count Stored Procedures for Pagination
-- =============================================

-- Get Medicines Count
CREATE OR ALTER PROCEDURE [dbo].[sp_GetMedicinesCount]
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT COUNT(*) FROM Medicines;
END
GO

-- Get Active Medicines Count
CREATE OR ALTER PROCEDURE [dbo].[sp_GetActiveMedicinesCount]
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT COUNT(*) FROM Medicines WHERE IsActive = 1;
END
GO

-- Search Medicines Count
CREATE OR ALTER PROCEDURE [dbo].[sp_SearchMedicinesCount]
    @SearchTerm NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT COUNT(*) 
    FROM Medicines
    WHERE 
        Name LIKE '%' + @SearchTerm + '%'
        OR GenericName LIKE '%' + @SearchTerm + '%'
        OR Manufacturer LIKE '%' + @SearchTerm + '%'
        OR DosageForm LIKE '%' + @SearchTerm + '%';
END
GO

-- Get Medicines by Manufacturer Count
CREATE OR ALTER PROCEDURE [dbo].[sp_GetMedicinesByManufacturerCount]
    @Manufacturer NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT COUNT(*) 
    FROM Medicines 
    WHERE Manufacturer = @Manufacturer;
END
GO

-- Get Medicines by Dosage Form Count
CREATE OR ALTER PROCEDURE [dbo].[sp_GetMedicinesByDosageFormCount]
    @DosageForm NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT COUNT(*) 
    FROM Medicines 
    WHERE DosageForm = @DosageForm;
END
GO

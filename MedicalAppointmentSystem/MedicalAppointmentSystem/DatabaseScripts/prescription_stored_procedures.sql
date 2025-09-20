-- Updated Prescription Stored Procedures
-- This file contains the corrected stored procedures for prescription management

-- 1. Create Prescription Stored Procedure
CREATE OR ALTER PROCEDURE sp_CreatePrescription
    @AppointmentId INT,
    @GeneralNotes NVARCHAR(MAX) = NULL,
    @FollowUpInstructions NVARCHAR(MAX) = NULL,
    @PrescriptionId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Insert prescription
        INSERT INTO Prescriptions (AppointmentId, GeneralNotes, FollowUpInstructions, PrescriptionDate, IsActive, CreatedDate, ModifiedDate)
        VALUES (@AppointmentId, @GeneralNotes, @FollowUpInstructions, GETDATE(), 1, GETDATE(), GETDATE());
        
        -- Get the newly created prescription ID
        SET @PrescriptionId = SCOPE_IDENTITY();
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- 2. Create Prescription Detail Stored Procedure (Updated)
CREATE OR ALTER PROCEDURE sp_CreatePrescriptionDetail
    @Id INT = 0,  -- Made optional with default value 0 for new records
    @PrescriptionId INT,
    @MedicineId INT,
    @Dosage NVARCHAR(200),
    @StartDate DATETIME2,
    @EndDate DATETIME2,
    @Notes NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Insert prescription detail
        INSERT INTO PrescriptionDetails (PrescriptionId, MedicineId, Dosage, StartDate, EndDate, Notes, IsActive, CreatedDate, ModifiedDate)
        VALUES (@PrescriptionId, @MedicineId, @Dosage, @StartDate, @EndDate, @Notes, 1, GETDATE(), GETDATE());
        
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

-- 3. Update Prescription Stored Procedure
CREATE OR ALTER PROCEDURE sp_UpdatePrescription
    @Id INT,
    @AppointmentId INT,
    @GeneralNotes NVARCHAR(MAX) = NULL,
    @FollowUpInstructions NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Update prescription
        UPDATE Prescriptions 
        SET AppointmentId = @AppointmentId,
            GeneralNotes = @GeneralNotes,
            FollowUpInstructions = @FollowUpInstructions,
            ModifiedDate = GETDATE()
        WHERE Id = @Id AND IsActive = 1;
        
        IF @@ROWCOUNT = 0
            THROW 50001, 'Prescription not found or already deleted', 1;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- 4. Update Prescription Detail Stored Procedure
CREATE OR ALTER PROCEDURE sp_UpdatePrescriptionDetail
    @Id INT,
    @PrescriptionId INT,
    @MedicineId INT,
    @Dosage NVARCHAR(200),
    @StartDate DATETIME2,
    @EndDate DATETIME2,
    @Notes NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Update prescription detail
        UPDATE PrescriptionDetails 
        SET MedicineId = @MedicineId,
            Dosage = @Dosage,
            StartDate = @StartDate,
            EndDate = @EndDate,
            Notes = @Notes,
            ModifiedDate = GETDATE()
        WHERE Id = @Id AND PrescriptionId = @PrescriptionId AND IsActive = 1;
        
        IF @@ROWCOUNT = 0
            THROW 50001, 'Prescription detail not found or already deleted', 1;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- 5. Delete Prescription Stored Procedure
CREATE OR ALTER PROCEDURE sp_DeletePrescription
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Soft delete prescription
        UPDATE Prescriptions 
        SET IsActive = 0, ModifiedDate = GETDATE()
        WHERE Id = @Id;
        
        -- Soft delete all prescription details
        UPDATE PrescriptionDetails 
        SET IsActive = 0, ModifiedDate = GETDATE()
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

-- 6. Get Prescription by ID Stored Procedure
CREATE OR ALTER PROCEDURE sp_GetPrescriptionById
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
        a.PatientName,
        a.DoctorName,
        a.AppointmentDate,
        a.VisitType
    FROM Prescriptions p
    INNER JOIN Appointments a ON p.AppointmentId = a.Id
    WHERE p.Id = @Id AND p.IsActive = 1;
    
    -- Get prescription details
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
    WHERE pd.PrescriptionId = @Id AND pd.IsActive = 1
    ORDER BY pd.Id;
END
GO

-- 7. Get All Prescriptions Stored Procedure
CREATE OR ALTER PROCEDURE sp_GetAllPrescriptions
    @Skip INT = 0,
    @Take INT = 10
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        p.Id,
        p.AppointmentId,
        p.GeneralNotes,
        p.FollowUpInstructions,
        p.PrescriptionDate,
        a.PatientName,
        a.DoctorName,
        a.AppointmentDate,
        a.VisitType
    FROM Prescriptions p
    INNER JOIN Appointments a ON p.AppointmentId = a.Id
    WHERE p.IsActive = 1
    ORDER BY p.PrescriptionDate DESC
    OFFSET @Skip ROWS
    FETCH NEXT @Take ROWS ONLY;
    
    -- Get total count
    SELECT COUNT(*) AS TotalCount
    FROM Prescriptions p
    WHERE p.IsActive = 1;
END
GO

-- 8. Get Prescription Details by Prescription ID Stored Procedure
CREATE OR ALTER PROCEDURE sp_GetPrescriptionDetailsByPrescriptionId
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

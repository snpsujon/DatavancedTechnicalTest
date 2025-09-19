-- Patient CRUD Stored Procedures
-- Run these scripts in your MedicalAppointmentSystem database

-- 1. Create Patients table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Patients' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[Patients](
        [Id] [int] IDENTITY(1,1) NOT NULL,
        [FirstName] [nvarchar](100) NOT NULL,
        [LastName] [nvarchar](100) NOT NULL,
        [Email] [nvarchar](200) NULL,
        [PhoneNumber] [nvarchar](20) NULL,
        [Address] [nvarchar](500) NULL,
        [DateOfBirth] [datetime2](7) NULL,
        [Gender] [nvarchar](10) NULL,
        [MedicalHistory] [nvarchar](500) NULL,
        [Allergies] [nvarchar](500) NULL,
        [EmergencyContactName] [nvarchar](500) NULL,
        [EmergencyContactPhone] [nvarchar](20) NULL,
        [IsActive] [bit] NOT NULL DEFAULT(1),
        [CreatedDate] [datetime2](7) NOT NULL,
        [UpdatedDate] [datetime2](7) NULL,
        [CreatedBy] [nvarchar](100) NULL,
        [UpdatedBy] [nvarchar](100) NULL,
        CONSTRAINT [PK_Patients] PRIMARY KEY CLUSTERED ([Id] ASC)
    )
END
GO

-- 2. Get All Patients
CREATE OR ALTER PROCEDURE [dbo].[sp_GetAllPatients]
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        Id, FirstName, LastName, Email, PhoneNumber, Address, 
        DateOfBirth, Gender, MedicalHistory, Allergies, 
        EmergencyContactName, EmergencyContactPhone, 
        IsActive, CreatedDate, UpdatedDate, CreatedBy, UpdatedBy
    FROM Patients 
    WHERE IsActive = 1
    ORDER BY CreatedDate DESC;
END
GO

-- 3. Get Patient by ID
CREATE OR ALTER PROCEDURE [dbo].[sp_GetPatientById]
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        Id, FirstName, LastName, Email, PhoneNumber, Address, 
        DateOfBirth, Gender, MedicalHistory, Allergies, 
        EmergencyContactName, EmergencyContactPhone, 
        IsActive, CreatedDate, UpdatedDate, CreatedBy, UpdatedBy
    FROM Patients 
    WHERE Id = @Id AND IsActive = 1;
END
GO

-- 4. Create Patient
CREATE OR ALTER PROCEDURE [dbo].[sp_CreatePatient]
    @FirstName NVARCHAR(100),
    @LastName NVARCHAR(100),
    @Email NVARCHAR(200) = NULL,
    @PhoneNumber NVARCHAR(20) = NULL,
    @Address NVARCHAR(500) = NULL,
    @DateOfBirth DATETIME2(7) = NULL,
    @Gender NVARCHAR(10) = NULL,
    @MedicalHistory NVARCHAR(500) = NULL,
    @Allergies NVARCHAR(500) = NULL,
    @EmergencyContactName NVARCHAR(500) = NULL,
    @EmergencyContactPhone NVARCHAR(20) = NULL,
    @IsActive BIT = 1,
    @CreatedBy NVARCHAR(100) = NULL,
    @Id INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Patients (
        FirstName, LastName, Email, PhoneNumber, Address, 
        DateOfBirth, Gender, MedicalHistory, Allergies, 
        EmergencyContactName, EmergencyContactPhone, 
        IsActive, CreatedDate, CreatedBy
    )
    VALUES (
        @FirstName, @LastName, @Email, @PhoneNumber, @Address, 
        @DateOfBirth, @Gender, @MedicalHistory, @Allergies, 
        @EmergencyContactName, @EmergencyContactPhone, 
        @IsActive, GETUTCDATE(), @CreatedBy
    );
    
    SET @Id = SCOPE_IDENTITY();
END
GO

-- 5. Update Patient
CREATE OR ALTER PROCEDURE [dbo].[sp_UpdatePatient]
    @Id INT,
    @FirstName NVARCHAR(100),
    @LastName NVARCHAR(100),
    @Email NVARCHAR(200) = NULL,
    @PhoneNumber NVARCHAR(20) = NULL,
    @Address NVARCHAR(500) = NULL,
    @DateOfBirth DATETIME2(7) = NULL,
    @Gender NVARCHAR(10) = NULL,
    @MedicalHistory NVARCHAR(500) = NULL,
    @Allergies NVARCHAR(500) = NULL,
    @EmergencyContactName NVARCHAR(500) = NULL,
    @EmergencyContactPhone NVARCHAR(20) = NULL,
    @IsActive BIT = 1,
    @UpdatedBy NVARCHAR(100) = NULL,
    @UpdatedDate DATETIME2(7)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Patients 
    SET 
        FirstName = @FirstName,
        LastName = @LastName,
        Email = @Email,
        PhoneNumber = @PhoneNumber,
        Address = @Address,
        DateOfBirth = @DateOfBirth,
        Gender = @Gender,
        MedicalHistory = @MedicalHistory,
        Allergies = @Allergies,
        EmergencyContactName = @EmergencyContactName,
        EmergencyContactPhone = @EmergencyContactPhone,
        IsActive = @IsActive,
        UpdatedDate = @UpdatedDate,
        UpdatedBy = @UpdatedBy
    WHERE Id = @Id;
END
GO

-- 6. Delete Patient (Soft Delete)
CREATE OR ALTER PROCEDURE [dbo].[sp_DeletePatient]
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Patients 
    SET IsActive = 0, UpdatedDate = GETUTCDATE()
    WHERE Id = @Id;
END
GO

-- 7. Search Patients
CREATE OR ALTER PROCEDURE [dbo].[sp_SearchPatients]
    @SearchTerm NVARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        Id, FirstName, LastName, Email, PhoneNumber, Address, 
        DateOfBirth, Gender, MedicalHistory, Allergies, 
        EmergencyContactName, EmergencyContactPhone, 
        IsActive, CreatedDate, UpdatedDate, CreatedBy, UpdatedBy
    FROM Patients 
    WHERE IsActive = 1 
    AND (
        FirstName LIKE '%' + @SearchTerm + '%' OR
        LastName LIKE '%' + @SearchTerm + '%' OR
        Email LIKE '%' + @SearchTerm + '%' OR
        PhoneNumber LIKE '%' + @SearchTerm + '%' OR
        CONCAT(FirstName, ' ', LastName) LIKE '%' + @SearchTerm + '%'
    )
    ORDER BY CreatedDate DESC;
END
GO

-- 8. Check if Patient Exists
CREATE OR ALTER PROCEDURE [dbo].[sp_PatientExists]
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT CASE WHEN EXISTS(SELECT 1 FROM Patients WHERE Id = @Id AND IsActive = 1) 
                THEN 1 ELSE 0 END;
END
GO

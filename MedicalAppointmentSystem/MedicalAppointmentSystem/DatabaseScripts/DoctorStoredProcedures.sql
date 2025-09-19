-- Doctor CRUD Stored Procedures
-- Run these scripts in your MedicalAppointmentSystem database

-- 1. Create Doctors table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Doctors' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[Doctors](
        [Id] [int] IDENTITY(1,1) NOT NULL,
        [FirstName] [nvarchar](100) NOT NULL,
        [LastName] [nvarchar](100) NOT NULL,
        [Email] [nvarchar](200) NULL,
        [PhoneNumber] [nvarchar](20) NULL,
        [Address] [nvarchar](500) NULL,
        [DateOfBirth] [datetime2](7) NULL,
        [Gender] [nvarchar](10) NULL,
        [Specialization] [nvarchar](100) NOT NULL,
        [LicenseNumber] [nvarchar](50) NULL,
        [Qualification] [nvarchar](100) NULL,
        [YearsOfExperience] [int] NULL,
        [Bio] [nvarchar](500) NULL,
        [ProfileImageUrl] [nvarchar](200) NULL,
        [Department] [nvarchar](100) NULL,
        [AvailableFrom] [time](7) NULL,
        [AvailableTo] [time](7) NULL,
        [ConsultationFee] [nvarchar](500) NULL,
        [IsActive] [bit] NOT NULL DEFAULT(1),
        [IsAvailable] [bit] NOT NULL DEFAULT(1),
        [CreatedDate] [datetime2](7) NOT NULL,
        [UpdatedDate] [datetime2](7) NULL,
        [CreatedBy] [nvarchar](100) NULL,
        [UpdatedBy] [nvarchar](100) NULL,
        CONSTRAINT [PK_Doctors] PRIMARY KEY CLUSTERED ([Id] ASC)
    )
END
GO

-- 2. Get All Doctors
CREATE OR ALTER PROCEDURE [dbo].[sp_GetAllDoctors]
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        Id, FirstName, LastName, Email, PhoneNumber, Address, 
        DateOfBirth, Gender, Specialization, LicenseNumber, 
        Qualification, YearsOfExperience, Bio, ProfileImageUrl, 
        Department, AvailableFrom, AvailableTo, ConsultationFee, 
        IsActive, IsAvailable, CreatedDate, UpdatedDate, CreatedBy, UpdatedBy
    FROM Doctors 
    WHERE IsActive = 1
    ORDER BY CreatedDate DESC;
END
GO

-- 3. Get Doctor by ID
CREATE OR ALTER PROCEDURE [dbo].[sp_GetDoctorById]
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        Id, FirstName, LastName, Email, PhoneNumber, Address, 
        DateOfBirth, Gender, Specialization, LicenseNumber, 
        Qualification, YearsOfExperience, Bio, ProfileImageUrl, 
        Department, AvailableFrom, AvailableTo, ConsultationFee, 
        IsActive, IsAvailable, CreatedDate, UpdatedDate, CreatedBy, UpdatedBy
    FROM Doctors 
    WHERE Id = @Id AND IsActive = 1;
END
GO

-- 4. Create Doctor
CREATE OR ALTER PROCEDURE [dbo].[sp_CreateDoctor]
    @FirstName NVARCHAR(100),
    @LastName NVARCHAR(100),
    @Email NVARCHAR(200) = NULL,
    @PhoneNumber NVARCHAR(20) = NULL,
    @Address NVARCHAR(500) = NULL,
    @DateOfBirth DATETIME2(7) = NULL,
    @Gender NVARCHAR(10) = NULL,
    @Specialization NVARCHAR(100),
    @LicenseNumber NVARCHAR(50) = NULL,
    @Qualification NVARCHAR(100) = NULL,
    @YearsOfExperience INT = NULL,
    @Bio NVARCHAR(500) = NULL,
    @ProfileImageUrl NVARCHAR(200) = NULL,
    @Department NVARCHAR(100) = NULL,
    @AvailableFrom TIME(7) = NULL,
    @AvailableTo TIME(7) = NULL,
    @ConsultationFee NVARCHAR(500) = NULL,
    @IsActive BIT = 1,
    @IsAvailable BIT = 1,
    @CreatedBy NVARCHAR(100) = NULL,
    @Id INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Doctors (
        FirstName, LastName, Email, PhoneNumber, Address, 
        DateOfBirth, Gender, Specialization, LicenseNumber, 
        Qualification, YearsOfExperience, Bio, ProfileImageUrl, 
        Department, AvailableFrom, AvailableTo, ConsultationFee, 
        IsActive, IsAvailable, CreatedDate, CreatedBy
    )
    VALUES (
        @FirstName, @LastName, @Email, @PhoneNumber, @Address, 
        @DateOfBirth, @Gender, @Specialization, @LicenseNumber, 
        @Qualification, @YearsOfExperience, @Bio, @ProfileImageUrl, 
        @Department, @AvailableFrom, @AvailableTo, @ConsultationFee, 
        @IsActive, @IsAvailable, GETUTCDATE(), @CreatedBy
    );
    
    SET @Id = SCOPE_IDENTITY();
END
GO

-- 5. Update Doctor
CREATE OR ALTER PROCEDURE [dbo].[sp_UpdateDoctor]
    @Id INT,
    @FirstName NVARCHAR(100),
    @LastName NVARCHAR(100),
    @Email NVARCHAR(200) = NULL,
    @PhoneNumber NVARCHAR(20) = NULL,
    @Address NVARCHAR(500) = NULL,
    @DateOfBirth DATETIME2(7) = NULL,
    @Gender NVARCHAR(10) = NULL,
    @Specialization NVARCHAR(100),
    @LicenseNumber NVARCHAR(50) = NULL,
    @Qualification NVARCHAR(100) = NULL,
    @YearsOfExperience INT = NULL,
    @Bio NVARCHAR(500) = NULL,
    @ProfileImageUrl NVARCHAR(200) = NULL,
    @Department NVARCHAR(100) = NULL,
    @AvailableFrom TIME(7) = NULL,
    @AvailableTo TIME(7) = NULL,
    @ConsultationFee NVARCHAR(500) = NULL,
    @IsActive BIT = 1,
    @IsAvailable BIT = 1,
    @UpdatedBy NVARCHAR(100) = NULL,
    @UpdatedDate DATETIME2(7)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Doctors 
    SET 
        FirstName = @FirstName,
        LastName = @LastName,
        Email = @Email,
        PhoneNumber = @PhoneNumber,
        Address = @Address,
        DateOfBirth = @DateOfBirth,
        Gender = @Gender,
        Specialization = @Specialization,
        LicenseNumber = @LicenseNumber,
        Qualification = @Qualification,
        YearsOfExperience = @YearsOfExperience,
        Bio = @Bio,
        ProfileImageUrl = @ProfileImageUrl,
        Department = @Department,
        AvailableFrom = @AvailableFrom,
        AvailableTo = @AvailableTo,
        ConsultationFee = @ConsultationFee,
        IsActive = @IsActive,
        IsAvailable = @IsAvailable,
        UpdatedDate = @UpdatedDate,
        UpdatedBy = @UpdatedBy
    WHERE Id = @Id;
END
GO

-- 6. Delete Doctor (Soft Delete)
CREATE OR ALTER PROCEDURE [dbo].[sp_DeleteDoctor]
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Doctors 
    SET IsActive = 0, UpdatedDate = GETUTCDATE()
    WHERE Id = @Id;
END
GO

-- 7. Search Doctors
CREATE OR ALTER PROCEDURE [dbo].[sp_SearchDoctors]
    @SearchTerm NVARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        Id, FirstName, LastName, Email, PhoneNumber, Address, 
        DateOfBirth, Gender, Specialization, LicenseNumber, 
        Qualification, YearsOfExperience, Bio, ProfileImageUrl, 
        Department, AvailableFrom, AvailableTo, ConsultationFee, 
        IsActive, IsAvailable, CreatedDate, UpdatedDate, CreatedBy, UpdatedBy
    FROM Doctors 
    WHERE IsActive = 1 
    AND (
        FirstName LIKE '%' + @SearchTerm + '%' OR
        LastName LIKE '%' + @SearchTerm + '%' OR
        Email LIKE '%' + @SearchTerm + '%' OR
        PhoneNumber LIKE '%' + @SearchTerm + '%' OR
        Specialization LIKE '%' + @SearchTerm + '%' OR
        Department LIKE '%' + @SearchTerm + '%' OR
        CONCAT(FirstName, ' ', LastName) LIKE '%' + @SearchTerm + '%'
    )
    ORDER BY CreatedDate DESC;
END
GO

-- 8. Get Doctors by Specialization
CREATE OR ALTER PROCEDURE [dbo].[sp_GetDoctorsBySpecialization]
    @Specialization NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        Id, FirstName, LastName, Email, PhoneNumber, Address, 
        DateOfBirth, Gender, Specialization, LicenseNumber, 
        Qualification, YearsOfExperience, Bio, ProfileImageUrl, 
        Department, AvailableFrom, AvailableTo, ConsultationFee, 
        IsActive, IsAvailable, CreatedDate, UpdatedDate, CreatedBy, UpdatedBy
    FROM Doctors 
    WHERE IsActive = 1 AND Specialization = @Specialization
    ORDER BY CreatedDate DESC;
END
GO

-- 9. Get Available Doctors
CREATE OR ALTER PROCEDURE [dbo].[sp_GetAvailableDoctors]
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        Id, FirstName, LastName, Email, PhoneNumber, Address, 
        DateOfBirth, Gender, Specialization, LicenseNumber, 
        Qualification, YearsOfExperience, Bio, ProfileImageUrl, 
        Department, AvailableFrom, AvailableTo, ConsultationFee, 
        IsActive, IsAvailable, CreatedDate, UpdatedDate, CreatedBy, UpdatedBy
    FROM Doctors 
    WHERE IsActive = 1 AND IsAvailable = 1
    ORDER BY CreatedDate DESC;
END
GO

-- 10. Check if Doctor Exists
CREATE OR ALTER PROCEDURE [dbo].[sp_DoctorExists]
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT CASE WHEN EXISTS(SELECT 1 FROM Doctors WHERE Id = @Id AND IsActive = 1) 
                THEN 1 ELSE 0 END;
END
GO

-- 11. Update Doctor Availability
CREATE OR ALTER PROCEDURE [dbo].[sp_UpdateDoctorAvailability]
    @Id INT,
    @IsAvailable BIT,
    @UpdatedDate DATETIME2(7)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Doctors 
    SET IsAvailable = @IsAvailable, UpdatedDate = @UpdatedDate
    WHERE Id = @Id AND IsActive = 1;
END
GO

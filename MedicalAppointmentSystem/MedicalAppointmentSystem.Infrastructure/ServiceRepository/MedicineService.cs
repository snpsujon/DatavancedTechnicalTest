using Dapper;
using MedicalAppointmentSystem.Application.ServiceInterface;
using MedicalAppointmentSystem.Domain.Models;
using MedicalAppointmentSystem.Domain.ViewModels;
using MedicalAppointmentSystem.Infrastructure.DBContext;
using System.Data;

namespace MedicalAppointmentSystem.Infrastructure.ServiceRepository
{
    public class MedicineService : IMedicineService
    {
        private readonly DapperContext _dapperContext;

        public MedicineService(DapperContext dapperContext)
        {
            _dapperContext = dapperContext;
        }

        public async Task<IEnumerable<MedicineVM>> GetAllMedicinesAsync(int skip = 0, int take = 50)
        {
            using var connection = _dapperContext.CreateConnection();
            
            // Use SQL query instead of stored procedure since sp_GetAllMedicines doesn't accept parameters
            var sql = @"
                SELECT Id, Name, GenericName, DosageForm, Strength, Manufacturer, 
                       Description, Indications, Contraindications, SideEffects, Instructions
                FROM Medicines 
                WHERE IsActive = 1
                ORDER BY Name
                OFFSET @Skip ROWS 
                FETCH NEXT @Take ROWS ONLY";

            var parameters = new DynamicParameters();
            parameters.Add("@Skip", skip);
            parameters.Add("@Take", take);

            var medicines = await connection.QueryAsync<MedicineVM>(sql, parameters);
            return medicines;
        }

        public async Task<MedicineVM?> GetMedicineByIdAsync(int id)
        {
            using var connection = _dapperContext.CreateConnection();
            
            var sql = @"
                SELECT Id, Name, GenericName, DosageForm, Strength, Manufacturer, 
                       Description, Indications, Contraindications, SideEffects, Instructions
                FROM Medicines 
                WHERE Id = @Id";

            var parameters = new DynamicParameters();
            parameters.Add("@Id", id);

            var medicine = await connection.QueryFirstOrDefaultAsync<MedicineVM>(sql, parameters);
            return medicine;
        }

        public async Task<MedicineVM> CreateMedicineAsync(Medicine medicine)
        {
            using var connection = _dapperContext.CreateConnection();
            
            var sql = @"
                INSERT INTO Medicines (Name, GenericName, DosageForm, Strength, Manufacturer, 
                                     Description, Indications, Contraindications, SideEffects, 
                                     Instructions, IsActive, CreatedDate, CreatedBy)
                VALUES (@Name, @GenericName, @DosageForm, @Strength, @Manufacturer, 
                       @Description, @Indications, @Contraindications, @SideEffects, 
                       @Instructions, @IsActive, @CreatedDate, @CreatedBy);
                SELECT CAST(SCOPE_IDENTITY() as int);";

            var parameters = new DynamicParameters();
            parameters.Add("@Name", medicine.Name);
            parameters.Add("@GenericName", medicine.GenericName);
            parameters.Add("@DosageForm", medicine.DosageForm);
            parameters.Add("@Strength", medicine.Strength);
            parameters.Add("@Manufacturer", medicine.Manufacturer);
            parameters.Add("@Description", medicine.Description);
            parameters.Add("@Indications", medicine.Indications);
            parameters.Add("@Contraindications", medicine.Contraindications);
            parameters.Add("@SideEffects", medicine.SideEffects);
            parameters.Add("@Instructions", medicine.Instructions);
            parameters.Add("@IsActive", medicine.IsActive);
            parameters.Add("@CreatedDate", medicine.CreatedDate);
            parameters.Add("@CreatedBy", medicine.CreatedBy);

            var id = await connection.QuerySingleAsync<int>(sql, parameters);
            medicine.Id = id;
            return await GetMedicineByIdAsync(medicine.Id);
        }

        public async Task<MedicineVM?> UpdateMedicineAsync(Medicine medicine)
        {
            using var connection = _dapperContext.CreateConnection();
            
            var sql = @"
                UPDATE Medicines 
                SET Name = @Name, GenericName = @GenericName, DosageForm = @DosageForm, 
                    Strength = @Strength, Manufacturer = @Manufacturer, Description = @Description, 
                    Indications = @Indications, Contraindications = @Contraindications, 
                    SideEffects = @SideEffects, Instructions = @Instructions, IsActive = @IsActive, 
                    UpdatedBy = @UpdatedBy, UpdatedDate = @UpdatedDate
                WHERE Id = @Id";

            var parameters = new DynamicParameters();
            parameters.Add("@Id", medicine.Id);
            parameters.Add("@Name", medicine.Name);
            parameters.Add("@GenericName", medicine.GenericName);
            parameters.Add("@DosageForm", medicine.DosageForm);
            parameters.Add("@Strength", medicine.Strength);
            parameters.Add("@Manufacturer", medicine.Manufacturer);
            parameters.Add("@Description", medicine.Description);
            parameters.Add("@Indications", medicine.Indications);
            parameters.Add("@Contraindications", medicine.Contraindications);
            parameters.Add("@SideEffects", medicine.SideEffects);
            parameters.Add("@Instructions", medicine.Instructions);
            parameters.Add("@IsActive", medicine.IsActive);
            parameters.Add("@UpdatedBy", medicine.UpdatedBy);
            parameters.Add("@UpdatedDate", medicine.UpdatedDate);

            var rowsAffected = await connection.ExecuteAsync(sql, parameters);
            return rowsAffected > 0 ? await GetMedicineByIdAsync(medicine.Id) : null;
        }

        public async Task<bool> DeleteMedicineAsync(int id)
        {
            using var connection = _dapperContext.CreateConnection();
            
            var sql = "DELETE FROM Medicines WHERE Id = @Id";
            var parameters = new DynamicParameters();
            parameters.Add("@Id", id);

            var rowsAffected = await connection.ExecuteAsync(sql, parameters);
            return rowsAffected > 0;
        }

        public async Task<bool> MedicineExistsAsync(int id)
        {
            using var connection = _dapperContext.CreateConnection();
            
            var sql = "SELECT COUNT(*) FROM Medicines WHERE Id = @Id";
            var parameters = new DynamicParameters();
            parameters.Add("@Id", id);

            var count = await connection.QueryFirstOrDefaultAsync<int>(sql, parameters);
            return count > 0;
        }

        public async Task<IEnumerable<MedicineVM>> GetActiveMedicinesAsync(int skip = 0, int take = 50)
        {
            using var connection = _dapperContext.CreateConnection();
            
            // Use SQL query instead of stored procedure
            var sql = @"
                SELECT Id, Name, GenericName, DosageForm, Strength, Manufacturer, 
                       Description, Indications, Contraindications, SideEffects, Instructions
                FROM Medicines 
                WHERE IsActive = 1
                ORDER BY Name
                OFFSET @Skip ROWS 
                FETCH NEXT @Take ROWS ONLY";

            var parameters = new DynamicParameters();
            parameters.Add("@Skip", skip);
            parameters.Add("@Take", take);

            var medicines = await connection.QueryAsync<MedicineVM>(sql, parameters);
            return medicines;
        }

        public async Task<IEnumerable<MedicineVM>> SearchMedicinesAsync(string searchTerm, int skip = 0, int take = 50)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@SearchTerm", searchTerm);
            parameters.Add("@Skip", skip);
            parameters.Add("@Take", take);

            var medicines = await connection.QueryAsync<MedicineVM>(
                "sp_SearchMedicines",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return medicines;
        }

        public async Task<IEnumerable<MedicineVM>> GetMedicinesByManufacturerAsync(string manufacturer, int skip = 0, int take = 50)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Manufacturer", manufacturer);
            parameters.Add("@Skip", skip);
            parameters.Add("@Take", take);

            var medicines = await connection.QueryAsync<MedicineVM>(
                "sp_GetMedicinesByManufacturer",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return medicines;
        }

        public async Task<IEnumerable<MedicineVM>> GetMedicinesByDosageFormAsync(string dosageForm, int skip = 0, int take = 50)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@DosageForm", dosageForm);
            parameters.Add("@Skip", skip);
            parameters.Add("@Take", take);

            var medicines = await connection.QueryAsync<MedicineVM>(
                "sp_GetMedicinesByDosageForm",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return medicines;
        }

        public async Task<int> GetMedicinesCountAsync()
        {
            using var connection = _dapperContext.CreateConnection();
            var sql = "SELECT COUNT(*) FROM Medicines WHERE IsActive = 1";
            var count = await connection.QueryFirstOrDefaultAsync<int>(sql);
            return count;
        }

        public async Task<int> GetActiveMedicinesCountAsync()
        {
            using var connection = _dapperContext.CreateConnection();
            var sql = "SELECT COUNT(*) FROM Medicines WHERE IsActive = 1";
            var count = await connection.QueryFirstOrDefaultAsync<int>(sql);
            return count;
        }

        public async Task<int> SearchMedicinesCountAsync(string searchTerm)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@SearchTerm", searchTerm);

            var count = await connection.QueryFirstOrDefaultAsync<int>(
                "sp_SearchMedicinesCount",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return count;
        }

        public async Task<int> GetMedicinesByManufacturerCountAsync(string manufacturer)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Manufacturer", manufacturer);

            var count = await connection.QueryFirstOrDefaultAsync<int>(
                "sp_GetMedicinesByManufacturerCount",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return count;
        }

        public async Task<int> GetMedicinesByDosageFormCountAsync(string dosageForm)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@DosageForm", dosageForm);

            var count = await connection.QueryFirstOrDefaultAsync<int>(
                "sp_GetMedicinesByDosageFormCount",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return count;
        }
    }
}

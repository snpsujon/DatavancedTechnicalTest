using Dapper;
using MedicalAppointmentSystem.Application.ServiceInterface;
using MedicalAppointmentSystem.Domain.ViewModels;
using MedicalAppointmentSystem.Infrastructure.DBContext;
using System.Data;

namespace MedicalAppointmentSystem.Infrastructure.ServiceRepository
{
    public class PrescriptionService : IPrescriptionService
    {
        private readonly DapperContext _dapperContext;

        public PrescriptionService(DapperContext dapperContext)
        {
            _dapperContext = dapperContext;
        }

        public async Task<IEnumerable<PrescriptionVM>> GetAllPrescriptionsAsync(int skip = 0, int take = 50)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Skip", skip);
            parameters.Add("@Take", take);

            var prescriptions = await connection.QueryAsync<PrescriptionVM>(
                "sp_GetAllPrescriptions",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return prescriptions;
        }

        public async Task<PrescriptionVM?> GetPrescriptionByIdAsync(int id)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Id", id);

            var prescription = await connection.QueryFirstOrDefaultAsync<PrescriptionVM>(
                "sp_GetPrescriptionById",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            if (prescription != null)
            {
                prescription.PrescriptionDetails = (await GetPrescriptionDetailsByPrescriptionIdAsync(id)).ToList();
            }

            return prescription;
        }

        public async Task<PrescriptionVM> CreatePrescriptionAsync(PrescriptionCreateVM prescription)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@AppointmentId", prescription.AppointmentId);
            parameters.Add("@GeneralNotes", prescription.GeneralNotes);
            parameters.Add("@FollowUpInstructions", prescription.FollowUpInstructions);
            parameters.Add("@CreatedBy", "System"); // This should be passed from the controller
            parameters.Add("@Id", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await connection.ExecuteAsync(
                "sp_CreatePrescription",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            var prescriptionId = parameters.Get<int>("@Id");

            // Add prescription details
            foreach (var detail in prescription.PrescriptionDetails)
            {
                var detailParams = new DynamicParameters();
                detailParams.Add("@PrescriptionId", prescriptionId);
                detailParams.Add("@MedicineId", detail.MedicineId);
                detailParams.Add("@Dosage", detail.Dosage);
                detailParams.Add("@StartDate", detail.StartDate);
                detailParams.Add("@EndDate", detail.EndDate);
                detailParams.Add("@Notes", detail.Notes);
                detailParams.Add("@CreatedBy", "System");

                await connection.ExecuteAsync(
                    "sp_CreatePrescriptionDetail",
                    detailParams,
                    commandType: CommandType.StoredProcedure
                );
            }

            return await GetPrescriptionByIdAsync(prescriptionId);
        }

        public async Task<PrescriptionVM?> UpdatePrescriptionAsync(PrescriptionUpdateVM prescription)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Id", prescription.Id);
            parameters.Add("@AppointmentId", prescription.AppointmentId);
            parameters.Add("@GeneralNotes", prescription.GeneralNotes);
            parameters.Add("@FollowUpInstructions", prescription.FollowUpInstructions);
            parameters.Add("@UpdatedBy", "System"); // This should be passed from the controller
            parameters.Add("@UpdatedDate", DateTime.UtcNow);

            var rowsAffected = await connection.ExecuteAsync(
                "sp_UpdatePrescription",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            if (rowsAffected > 0)
            {
                // Update prescription details
                foreach (var detail in prescription.PrescriptionDetails)
                {
                    if (detail.IsDeleted && detail.Id > 0)
                    {
                        await DeletePrescriptionDetailAsync(detail.Id);
                    }
                    else if (detail.Id > 0)
                    {
                        await UpdatePrescriptionDetailAsync(detail);
                    }
                    else
                    {
                        var addDetail = new PrescriptionDetailAddVM
                        {
                            PrescriptionId = prescription.Id,
                            MedicineId = detail.MedicineId,
                            Dosage = detail.Dosage,
                            StartDate = detail.StartDate,
                            EndDate = detail.EndDate,
                            Notes = detail.Notes
                        };
                        await AddPrescriptionDetailAsync(addDetail);
                    }
                }

                return await GetPrescriptionByIdAsync(prescription.Id);
            }

            return null;
        }

        public async Task<bool> DeletePrescriptionAsync(int id)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Id", id);

            var rowsAffected = await connection.ExecuteAsync(
                "sp_DeletePrescription",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return rowsAffected > 0;
        }

        public async Task<bool> PrescriptionExistsAsync(int id)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Id", id);

            var exists = await connection.QueryFirstOrDefaultAsync<bool>(
                "sp_PrescriptionExists",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return exists;
        }

        public async Task<PrescriptionVM?> GetPrescriptionByAppointmentIdAsync(int appointmentId)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@AppointmentId", appointmentId);

            var prescription = await connection.QueryFirstOrDefaultAsync<PrescriptionVM>(
                "sp_GetPrescriptionByAppointmentId",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            if (prescription != null)
            {
                prescription.PrescriptionDetails = (await GetPrescriptionDetailsByPrescriptionIdAsync(prescription.Id)).ToList();
            }

            return prescription;
        }

        public async Task<PrescriptionVM> CreateOrUpdatePrescriptionForAppointmentAsync(PrescriptionCreateVM prescription)
        {
            var existingPrescription = await GetPrescriptionByAppointmentIdAsync(prescription.AppointmentId);

            if (existingPrescription != null)
            {
                var updateVM = new PrescriptionUpdateVM
                {
                    Id = existingPrescription.Id,
                    AppointmentId = prescription.AppointmentId,
                    GeneralNotes = prescription.GeneralNotes,
                    FollowUpInstructions = prescription.FollowUpInstructions,
                    PrescriptionDetails = prescription.PrescriptionDetails.Select(d => new PrescriptionDetailUpdateVM
                    {
                        Id = 0, // New items
                        PrescriptionId = existingPrescription.Id,
                        MedicineId = d.MedicineId,
                        Dosage = d.Dosage,
                        StartDate = d.StartDate,
                        EndDate = d.EndDate,
                        Notes = d.Notes
                    }).ToList()
                };

                var result = await UpdatePrescriptionAsync(updateVM);
                return result ?? existingPrescription;
            }
            else
            {
                return await CreatePrescriptionAsync(prescription);
            }
        }

        public async Task<PrescriptionDetailVM> AddPrescriptionDetailAsync(PrescriptionDetailAddVM prescriptionDetail)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@PrescriptionId", prescriptionDetail.PrescriptionId);
            parameters.Add("@MedicineId", prescriptionDetail.MedicineId);
            parameters.Add("@Dosage", prescriptionDetail.Dosage);
            parameters.Add("@StartDate", prescriptionDetail.StartDate);
            parameters.Add("@EndDate", prescriptionDetail.EndDate);
            parameters.Add("@Notes", prescriptionDetail.Notes);
            parameters.Add("@CreatedBy", "System");
            parameters.Add("@Id", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await connection.ExecuteAsync(
                "sp_CreatePrescriptionDetail",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            var detailId = parameters.Get<int>("@Id");
            return await GetPrescriptionDetailByIdAsync(detailId);
        }

        public async Task<PrescriptionDetailVM?> UpdatePrescriptionDetailAsync(PrescriptionDetailUpdateVM prescriptionDetail)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Id", prescriptionDetail.Id);
            parameters.Add("@PrescriptionId", prescriptionDetail.PrescriptionId);
            parameters.Add("@MedicineId", prescriptionDetail.MedicineId);
            parameters.Add("@Dosage", prescriptionDetail.Dosage);
            parameters.Add("@StartDate", prescriptionDetail.StartDate);
            parameters.Add("@EndDate", prescriptionDetail.EndDate);
            parameters.Add("@Notes", prescriptionDetail.Notes);
            parameters.Add("@UpdatedBy", "System");
            parameters.Add("@UpdatedDate", DateTime.UtcNow);

            var rowsAffected = await connection.ExecuteAsync(
                "sp_UpdatePrescriptionDetail",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return rowsAffected > 0 ? await GetPrescriptionDetailByIdAsync(prescriptionDetail.Id) : null;
        }

        public async Task<bool> DeletePrescriptionDetailAsync(int prescriptionDetailId)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Id", prescriptionDetailId);

            var rowsAffected = await connection.ExecuteAsync(
                "sp_DeletePrescriptionDetail",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return rowsAffected > 0;
        }

        public async Task<IEnumerable<PrescriptionDetailVM>> GetPrescriptionDetailsByPrescriptionIdAsync(int prescriptionId)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@PrescriptionId", prescriptionId);

            var details = await connection.QueryAsync<PrescriptionDetailVM>(
                "sp_GetPrescriptionDetailsByPrescriptionId",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return details;
        }

        public async Task<PrescriptionVM> UpdatePrescriptionGridAsync(PrescriptionGridOperationVM gridOperation)
        {
            using var connection = _dapperContext.CreateConnection();

            // Update each prescription detail
            foreach (var detail in gridOperation.PrescriptionDetails)
            {
                if (detail.IsDeleted && detail.Id > 0)
                {
                    await DeletePrescriptionDetailAsync(detail.Id);
                }
                else if (detail.Id > 0)
                {
                    await UpdatePrescriptionDetailAsync(detail);
                }
                else
                {
                    var addDetail = new PrescriptionDetailAddVM
                    {
                        PrescriptionId = gridOperation.PrescriptionId,
                        MedicineId = detail.MedicineId,
                        Dosage = detail.Dosage,
                        StartDate = detail.StartDate,
                        EndDate = detail.EndDate,
                        Notes = detail.Notes
                    };
                    await AddPrescriptionDetailAsync(addDetail);
                }
            }

            return await GetPrescriptionByIdAsync(gridOperation.PrescriptionId);
        }

        public async Task<bool> AddNewRowToPrescriptionAsync(int prescriptionId, PrescriptionDetailAddVM prescriptionDetail)
        {
            prescriptionDetail.PrescriptionId = prescriptionId;
            var result = await AddPrescriptionDetailAsync(prescriptionDetail);
            return result != null;
        }

        public async Task<bool> UpdateRowInPrescriptionAsync(PrescriptionDetailUpdateVM prescriptionDetail)
        {
            var result = await UpdatePrescriptionDetailAsync(prescriptionDetail);
            return result != null;
        }

        public async Task<bool> DeleteRowFromPrescriptionAsync(int prescriptionDetailId)
        {
            return await DeletePrescriptionDetailAsync(prescriptionDetailId);
        }

        public async Task<IEnumerable<PrescriptionVM>> GetPrescriptionsByPatientIdAsync(int patientId, int skip = 0, int take = 50)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@PatientId", patientId);
            parameters.Add("@Skip", skip);
            parameters.Add("@Take", take);

            var prescriptions = await connection.QueryAsync<PrescriptionVM>(
                "sp_GetPrescriptionsByPatientId",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return prescriptions;
        }

        public async Task<IEnumerable<PrescriptionVM>> GetPrescriptionsByDoctorIdAsync(int doctorId, int skip = 0, int take = 50)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@DoctorId", doctorId);
            parameters.Add("@Skip", skip);
            parameters.Add("@Take", take);

            var prescriptions = await connection.QueryAsync<PrescriptionVM>(
                "sp_GetPrescriptionsByDoctorId",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return prescriptions;
        }

        public async Task<IEnumerable<PrescriptionVM>> GetPrescriptionsByDateRangeAsync(DateTime startDate, DateTime endDate, int skip = 0, int take = 50)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@StartDate", startDate.Date);
            parameters.Add("@EndDate", endDate.Date);
            parameters.Add("@Skip", skip);
            parameters.Add("@Take", take);

            var prescriptions = await connection.QueryAsync<PrescriptionVM>(
                "sp_GetPrescriptionsByDateRange",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return prescriptions;
        }

        public async Task<IEnumerable<PrescriptionVM>> SearchPrescriptionsAsync(string searchTerm, int skip = 0, int take = 50)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@SearchTerm", searchTerm);
            parameters.Add("@Skip", skip);
            parameters.Add("@Take", take);

            var prescriptions = await connection.QueryAsync<PrescriptionVM>(
                "sp_SearchPrescriptions",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return prescriptions;
        }

        public async Task<bool> ValidatePrescriptionDatesAsync(DateTime startDate, DateTime endDate)
        {
            return startDate <= endDate;
        }

        public async Task<bool> ValidateMedicineExistsAsync(int medicineId)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Id", medicineId);

            var exists = await connection.QueryFirstOrDefaultAsync<bool>(
                "sp_MedicineExists",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return exists;
        }

        private async Task<PrescriptionDetailVM?> GetPrescriptionDetailByIdAsync(int id)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Id", id);

            var detail = await connection.QueryFirstOrDefaultAsync<PrescriptionDetailVM>(
                "sp_GetPrescriptionDetailById",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return detail;
        }

        public async Task<int> GetPrescriptionsCountAsync()
        {
            using var connection = _dapperContext.CreateConnection();
            var count = await connection.QueryFirstOrDefaultAsync<int>(
                "sp_GetPrescriptionsCount",
                commandType: CommandType.StoredProcedure
            );
            return count;
        }

        public async Task<int> GetPrescriptionsByPatientIdCountAsync(int patientId)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@PatientId", patientId);

            var count = await connection.QueryFirstOrDefaultAsync<int>(
                "sp_GetPrescriptionsByPatientIdCount",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return count;
        }

        public async Task<int> GetPrescriptionsByDoctorIdCountAsync(int doctorId)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@DoctorId", doctorId);

            var count = await connection.QueryFirstOrDefaultAsync<int>(
                "sp_GetPrescriptionsByDoctorIdCount",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return count;
        }

        public async Task<int> GetPrescriptionsByDateRangeCountAsync(DateTime startDate, DateTime endDate)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@StartDate", startDate.Date);
            parameters.Add("@EndDate", endDate.Date);

            var count = await connection.QueryFirstOrDefaultAsync<int>(
                "sp_GetPrescriptionsByDateRangeCount",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return count;
        }

        public async Task<int> SearchPrescriptionsCountAsync(string searchTerm)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@SearchTerm", searchTerm);

            var count = await connection.QueryFirstOrDefaultAsync<int>(
                "sp_SearchPrescriptionsCount",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return count;
        }
    }
}

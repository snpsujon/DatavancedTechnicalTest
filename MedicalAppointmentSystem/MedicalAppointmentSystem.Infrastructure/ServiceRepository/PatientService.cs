using Dapper;
using MedicalAppointmentSystem.Application.ServiceInterface;
using MedicalAppointmentSystem.Domain.Models;
using MedicalAppointmentSystem.Infrastructure.DBContext;
using System.Data;

namespace MedicalAppointmentSystem.Infrastructure.ServiceRepository
{
    public class PatientService : IPatientService
    {
        private readonly DapperContext _dapperContext;

        public PatientService(DapperContext dapperContext)
        {
            _dapperContext = dapperContext;
        }

        public async Task<IEnumerable<Patient>> GetAllPatientsAsync()
        {
            using var connection = _dapperContext.CreateConnection();
            var patients = await connection.QueryAsync<Patient>(
                "sp_GetAllPatients",
                commandType: CommandType.StoredProcedure
            );
            return patients;
        }

        public async Task<Patient?> GetPatientByIdAsync(int id)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Id", id);

            var patient = await connection.QueryFirstOrDefaultAsync<Patient>(
                "sp_GetPatientById",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return patient;
        }

        public async Task<Patient> CreatePatientAsync(Patient patient)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@FirstName", patient.FirstName);
            parameters.Add("@LastName", patient.LastName);
            parameters.Add("@Email", patient.Email);
            parameters.Add("@PhoneNumber", patient.PhoneNumber);
            parameters.Add("@Address", patient.Address);
            parameters.Add("@DateOfBirth", patient.DateOfBirth);
            parameters.Add("@Gender", patient.Gender);
            parameters.Add("@MedicalHistory", patient.MedicalHistory);
            parameters.Add("@Allergies", patient.Allergies);
            parameters.Add("@EmergencyContactName", patient.EmergencyContactName);
            parameters.Add("@EmergencyContactPhone", patient.EmergencyContactPhone);
            parameters.Add("@IsActive", patient.IsActive);
            parameters.Add("@CreatedBy", patient.CreatedBy);
            parameters.Add("@Id", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await connection.ExecuteAsync(
                "sp_CreatePatient",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            patient.Id = parameters.Get<int>("@Id");
            return patient;
        }

        public async Task<Patient?> UpdatePatientAsync(Patient patient)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Id", patient.Id);
            parameters.Add("@FirstName", patient.FirstName);
            parameters.Add("@LastName", patient.LastName);
            parameters.Add("@Email", patient.Email);
            parameters.Add("@PhoneNumber", patient.PhoneNumber);
            parameters.Add("@Address", patient.Address);
            parameters.Add("@DateOfBirth", patient.DateOfBirth);
            parameters.Add("@Gender", patient.Gender);
            parameters.Add("@MedicalHistory", patient.MedicalHistory);
            parameters.Add("@Allergies", patient.Allergies);
            parameters.Add("@EmergencyContactName", patient.EmergencyContactName);
            parameters.Add("@EmergencyContactPhone", patient.EmergencyContactPhone);
            parameters.Add("@IsActive", patient.IsActive);
            parameters.Add("@UpdatedBy", patient.UpdatedBy);
            parameters.Add("@UpdatedDate", DateTime.UtcNow);

            var rowsAffected = await connection.ExecuteAsync(
                "sp_UpdatePatient",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return rowsAffected > 0 ? patient : null;
        }

        public async Task<bool> DeletePatientAsync(int id)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Id", id);

            var rowsAffected = await connection.ExecuteAsync(
                "sp_DeletePatient",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return rowsAffected > 0;
        }

        public async Task<IEnumerable<Patient>> SearchPatientsAsync(string searchTerm)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@SearchTerm", searchTerm);

            var patients = await connection.QueryAsync<Patient>(
                "sp_SearchPatients",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return patients;
        }

        public async Task<bool> PatientExistsAsync(int id)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Id", id);

            var exists = await connection.QueryFirstOrDefaultAsync<bool>(
                "sp_PatientExists",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return exists;
        }
    }
}

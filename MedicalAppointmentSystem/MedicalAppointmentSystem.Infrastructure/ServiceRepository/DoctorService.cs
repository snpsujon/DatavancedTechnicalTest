using Dapper;
using MedicalAppointmentSystem.Application.ServiceInterface;
using MedicalAppointmentSystem.Domain.Models;
using MedicalAppointmentSystem.Infrastructure.DBContext;
using System.Data;

namespace MedicalAppointmentSystem.Infrastructure.ServiceRepository
{
    public class DoctorService : IDoctorService
    {
        private readonly DapperContext _dapperContext;

        public DoctorService(DapperContext dapperContext)
        {
            _dapperContext = dapperContext;
        }

        public async Task<IEnumerable<Doctor>> GetAllDoctorsAsync()
        {
            using var connection = _dapperContext.CreateConnection();
            var doctors = await connection.QueryAsync<Doctor>(
                "sp_GetAllDoctors",
                commandType: CommandType.StoredProcedure
            );
            return doctors;
        }

        public async Task<Doctor?> GetDoctorByIdAsync(int id)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Id", id);

            var doctor = await connection.QueryFirstOrDefaultAsync<Doctor>(
                "sp_GetDoctorById",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return doctor;
        }

        public async Task<Doctor> CreateDoctorAsync(Doctor doctor)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@FirstName", doctor.FirstName);
            parameters.Add("@LastName", doctor.LastName);
            parameters.Add("@Email", doctor.Email);
            parameters.Add("@PhoneNumber", doctor.PhoneNumber);
            parameters.Add("@Address", doctor.Address);
            parameters.Add("@DateOfBirth", doctor.DateOfBirth);
            parameters.Add("@Gender", doctor.Gender);
            parameters.Add("@Specialization", doctor.Specialization);
            parameters.Add("@LicenseNumber", doctor.LicenseNumber);
            parameters.Add("@Qualification", doctor.Qualification);
            parameters.Add("@YearsOfExperience", doctor.YearsOfExperience);
            parameters.Add("@Bio", doctor.Bio);
            parameters.Add("@ProfileImageUrl", doctor.ProfileImageUrl);
            parameters.Add("@Department", doctor.Department);
            parameters.Add("@AvailableFrom", doctor.AvailableFrom);
            parameters.Add("@AvailableTo", doctor.AvailableTo);
            parameters.Add("@ConsultationFee", doctor.ConsultationFee);
            parameters.Add("@IsActive", doctor.IsActive);
            parameters.Add("@IsAvailable", doctor.IsAvailable);
            parameters.Add("@CreatedBy", doctor.CreatedBy);
            parameters.Add("@Id", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await connection.ExecuteAsync(
                "sp_CreateDoctor",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            doctor.Id = parameters.Get<int>("@Id");
            return doctor;
        }

        public async Task<Doctor?> UpdateDoctorAsync(Doctor doctor)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Id", doctor.Id);
            parameters.Add("@FirstName", doctor.FirstName);
            parameters.Add("@LastName", doctor.LastName);
            parameters.Add("@Email", doctor.Email);
            parameters.Add("@PhoneNumber", doctor.PhoneNumber);
            parameters.Add("@Address", doctor.Address);
            parameters.Add("@DateOfBirth", doctor.DateOfBirth);
            parameters.Add("@Gender", doctor.Gender);
            parameters.Add("@Specialization", doctor.Specialization);
            parameters.Add("@LicenseNumber", doctor.LicenseNumber);
            parameters.Add("@Qualification", doctor.Qualification);
            parameters.Add("@YearsOfExperience", doctor.YearsOfExperience);
            parameters.Add("@Bio", doctor.Bio);
            parameters.Add("@ProfileImageUrl", doctor.ProfileImageUrl);
            parameters.Add("@Department", doctor.Department);
            parameters.Add("@AvailableFrom", doctor.AvailableFrom);
            parameters.Add("@AvailableTo", doctor.AvailableTo);
            parameters.Add("@ConsultationFee", doctor.ConsultationFee);
            parameters.Add("@IsActive", doctor.IsActive);
            parameters.Add("@IsAvailable", doctor.IsAvailable);
            parameters.Add("@UpdatedBy", doctor.UpdatedBy);
            parameters.Add("@UpdatedDate", DateTime.UtcNow);

            var rowsAffected = await connection.ExecuteAsync(
                "sp_UpdateDoctor",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return rowsAffected > 0 ? doctor : null;
        }

        public async Task<bool> DeleteDoctorAsync(int id)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Id", id);

            var rowsAffected = await connection.ExecuteAsync(
                "sp_DeleteDoctor",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return rowsAffected > 0;
        }

        public async Task<IEnumerable<Doctor>> SearchDoctorsAsync(string searchTerm)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@SearchTerm", searchTerm);

            var doctors = await connection.QueryAsync<Doctor>(
                "sp_SearchDoctors",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return doctors;
        }

        public async Task<IEnumerable<Doctor>> GetDoctorsBySpecializationAsync(string specialization)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Specialization", specialization);

            var doctors = await connection.QueryAsync<Doctor>(
                "sp_GetDoctorsBySpecialization",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return doctors;
        }

        public async Task<IEnumerable<Doctor>> GetAvailableDoctorsAsync()
        {
            using var connection = _dapperContext.CreateConnection();
            var doctors = await connection.QueryAsync<Doctor>(
                "sp_GetAvailableDoctors",
                commandType: CommandType.StoredProcedure
            );
            return doctors;
        }

        public async Task<bool> DoctorExistsAsync(int id)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Id", id);

            var exists = await connection.QueryFirstOrDefaultAsync<bool>(
                "sp_DoctorExists",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return exists;
        }

        public async Task<bool> UpdateDoctorAvailabilityAsync(int id, bool isAvailable)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Id", id);
            parameters.Add("@IsAvailable", isAvailable);
            parameters.Add("@UpdatedDate", DateTime.UtcNow);

            var rowsAffected = await connection.ExecuteAsync(
                "sp_UpdateDoctorAvailability",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return rowsAffected > 0;
        }
    }
}


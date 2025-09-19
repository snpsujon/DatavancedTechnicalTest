using Dapper;
using MedicalAppointmentSystem.Application.ServiceInterface;
using MedicalAppointmentSystem.Domain.Models;
using MedicalAppointmentSystem.Domain.ViewModels;
using MedicalAppointmentSystem.Infrastructure.DBContext;
using System.Data;

namespace MedicalAppointmentSystem.Infrastructure.ServiceRepository
{
    public class AppointmentService : IAppointmentService
    {
        private readonly DapperContext _dapperContext;

        public AppointmentService(DapperContext dapperContext)
        {
            _dapperContext = dapperContext;
        }

        public async Task<IEnumerable<AppointmentVM>> GetAllAppointmentsAsync(int skip = 0, int take = 50)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Skip", skip);
            parameters.Add("@Take", take);

            var appointments = await connection.QueryAsync<AppointmentVM>(
                "sp_GetAllAppointments",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return appointments;
        }

        public async Task<AppointmentVM?> GetAppointmentByIdAsync(int id)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Id", id);

            var appointment = await connection.QueryFirstOrDefaultAsync<AppointmentVM>(
                "sp_GetAppointmentById",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return appointment;
        }

        public async Task<AppointmentVM> CreateAppointmentAsync(AppointmentCreateVM appointment)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@PatientId", appointment.PatientId);
            parameters.Add("@DoctorId", appointment.DoctorId);
            parameters.Add("@AppointmentDate", appointment.AppointmentDate);
            parameters.Add("@VisitType", appointment.VisitType);
            parameters.Add("@Notes", appointment.Notes);
            parameters.Add("@Diagnosis", appointment.Diagnosis);
            parameters.Add("@CreatedBy", "System"); // This should be passed from the controller
            parameters.Add("@Id", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await connection.ExecuteAsync(
                "sp_CreateAppointment",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            var appointmentId = parameters.Get<int>("@Id");
            return await GetAppointmentByIdAsync(appointmentId);
        }

        public async Task<AppointmentVM?> UpdateAppointmentAsync(AppointmentUpdateVM appointment)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Id", appointment.Id);
            parameters.Add("@PatientId", appointment.PatientId);
            parameters.Add("@DoctorId", appointment.DoctorId);
            parameters.Add("@AppointmentDate", appointment.AppointmentDate);
            parameters.Add("@VisitType", appointment.VisitType);
            parameters.Add("@Notes", appointment.Notes);
            parameters.Add("@Diagnosis", appointment.Diagnosis);
            parameters.Add("@Status", appointment.Status);
            parameters.Add("@UpdatedBy", "System"); // This should be passed from the controller
            parameters.Add("@UpdatedDate", DateTime.UtcNow);

            var rowsAffected = await connection.ExecuteAsync(
                "sp_UpdateAppointment",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return rowsAffected > 0 ? await GetAppointmentByIdAsync(appointment.Id) : null;
        }

        public async Task<bool> DeleteAppointmentAsync(int id)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Id", id);

            var rowsAffected = await connection.ExecuteAsync(
                "sp_DeleteAppointment",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return rowsAffected > 0;
        }

        public async Task<bool> AppointmentExistsAsync(int id)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Id", id);

            var exists = await connection.QueryFirstOrDefaultAsync<bool>(
                "sp_AppointmentExists",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return exists;
        }

        public async Task<IEnumerable<AppointmentVM>> GetAppointmentsByPatientIdAsync(int patientId, int skip = 0, int take = 50)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@PatientId", patientId);
            parameters.Add("@Skip", skip);
            parameters.Add("@Take", take);

            var appointments = await connection.QueryAsync<AppointmentVM>(
                "sp_GetAppointmentsByPatientId",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return appointments;
        }

        public async Task<IEnumerable<AppointmentVM>> GetAppointmentsByDoctorIdAsync(int doctorId, int skip = 0, int take = 50)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@DoctorId", doctorId);
            parameters.Add("@Skip", skip);
            parameters.Add("@Take", take);

            var appointments = await connection.QueryAsync<AppointmentVM>(
                "sp_GetAppointmentsByDoctorId",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return appointments;
        }

        public async Task<IEnumerable<AppointmentVM>> GetAppointmentsByDateAsync(DateTime date, int skip = 0, int take = 50)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Date", date.Date);
            parameters.Add("@Skip", skip);
            parameters.Add("@Take", take);

            var appointments = await connection.QueryAsync<AppointmentVM>(
                "sp_GetAppointmentsByDate",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return appointments;
        }

        public async Task<IEnumerable<AppointmentVM>> GetAppointmentsByDateRangeAsync(DateTime startDate, DateTime endDate, int skip = 0, int take = 50)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@StartDate", startDate.Date);
            parameters.Add("@EndDate", endDate.Date);
            parameters.Add("@Skip", skip);
            parameters.Add("@Take", take);

            var appointments = await connection.QueryAsync<AppointmentVM>(
                "sp_GetAppointmentsByDateRange",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return appointments;
        }

        public async Task<IEnumerable<AppointmentVM>> GetAppointmentsByStatusAsync(string status, int skip = 0, int take = 50)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Status", status);
            parameters.Add("@Skip", skip);
            parameters.Add("@Take", take);

            var appointments = await connection.QueryAsync<AppointmentVM>(
                "sp_GetAppointmentsByStatus",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return appointments;
        }

        public async Task<IEnumerable<AppointmentVM>> GetUpcomingAppointmentsAsync(int skip = 0, int take = 50)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Skip", skip);
            parameters.Add("@Take", take);

            var appointments = await connection.QueryAsync<AppointmentVM>(
                "sp_GetUpcomingAppointments",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return appointments;
        }

        public async Task<IEnumerable<AppointmentVM>> GetTodaysAppointmentsAsync(int skip = 0, int take = 50)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Skip", skip);
            parameters.Add("@Take", take);

            var appointments = await connection.QueryAsync<AppointmentVM>(
                "sp_GetTodaysAppointments",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return appointments;
        }

        public async Task<IEnumerable<AppointmentVM>> SearchAppointmentsAsync(string searchTerm, int skip = 0, int take = 50)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@SearchTerm", searchTerm);
            parameters.Add("@Skip", skip);
            parameters.Add("@Take", take);

            var appointments = await connection.QueryAsync<AppointmentVM>(
                "sp_SearchAppointments",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return appointments;
        }

        public async Task<IEnumerable<AppointmentVM>> GetAppointmentsByVisitTypeAsync(string visitType, int skip = 0, int take = 50)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@VisitType", visitType);
            parameters.Add("@Skip", skip);
            parameters.Add("@Take", take);

            var appointments = await connection.QueryAsync<AppointmentVM>(
                "sp_GetAppointmentsByVisitType",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return appointments;
        }

        public async Task<bool> UpdateAppointmentStatusAsync(int id, string status)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Id", id);
            parameters.Add("@Status", status);
            parameters.Add("@UpdatedDate", DateTime.UtcNow);

            var rowsAffected = await connection.ExecuteAsync(
                "sp_UpdateAppointmentStatus",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return rowsAffected > 0;
        }

        public async Task<bool> CancelAppointmentAsync(int id)
        {
            return await UpdateAppointmentStatusAsync(id, "Cancelled");
        }

        public async Task<bool> CompleteAppointmentAsync(int id)
        {
            return await UpdateAppointmentStatusAsync(id, "Completed");
        }

        public async Task<bool> IsDoctorAvailableAsync(int doctorId, DateTime appointmentDate)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@DoctorId", doctorId);
            parameters.Add("@AppointmentDate", appointmentDate);

            var isAvailable = await connection.QueryFirstOrDefaultAsync<bool>(
                "sp_IsDoctorAvailable",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return isAvailable;
        }

        public async Task<bool> IsTimeSlotAvailableAsync(int doctorId, DateTime appointmentDate)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@DoctorId", doctorId);
            parameters.Add("@AppointmentDate", appointmentDate);

            var isAvailable = await connection.QueryFirstOrDefaultAsync<bool>(
                "sp_IsTimeSlotAvailable",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return isAvailable;
        }

        public async Task<IEnumerable<DateTime>> GetAvailableTimeSlotsAsync(int doctorId, DateTime date)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@DoctorId", doctorId);
            parameters.Add("@Date", date.Date);

            var timeSlots = await connection.QueryAsync<DateTime>(
                "sp_GetAvailableTimeSlots",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return timeSlots;
        }

        public async Task<int> GetAppointmentsCountAsync()
        {
            using var connection = _dapperContext.CreateConnection();
            var count = await connection.QueryFirstOrDefaultAsync<int>(
                "sp_GetAppointmentsCount",
                commandType: CommandType.StoredProcedure
            );
            return count;
        }

        public async Task<int> GetAppointmentsByPatientIdCountAsync(int patientId)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@PatientId", patientId);

            var count = await connection.QueryFirstOrDefaultAsync<int>(
                "sp_GetAppointmentsByPatientIdCount",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return count;
        }

        public async Task<int> GetAppointmentsByDoctorIdCountAsync(int doctorId)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@DoctorId", doctorId);

            var count = await connection.QueryFirstOrDefaultAsync<int>(
                "sp_GetAppointmentsByDoctorIdCount",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return count;
        }

        public async Task<int> GetAppointmentsByDateCountAsync(DateTime date)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Date", date.Date);

            var count = await connection.QueryFirstOrDefaultAsync<int>(
                "sp_GetAppointmentsByDateCount",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return count;
        }

        public async Task<int> GetAppointmentsByDateRangeCountAsync(DateTime startDate, DateTime endDate)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@StartDate", startDate.Date);
            parameters.Add("@EndDate", endDate.Date);

            var count = await connection.QueryFirstOrDefaultAsync<int>(
                "sp_GetAppointmentsByDateRangeCount",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return count;
        }

        public async Task<int> GetAppointmentsByStatusCountAsync(string status)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Status", status);

            var count = await connection.QueryFirstOrDefaultAsync<int>(
                "sp_GetAppointmentsByStatusCount",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return count;
        }

        public async Task<int> GetUpcomingAppointmentsCountAsync()
        {
            using var connection = _dapperContext.CreateConnection();
            var count = await connection.QueryFirstOrDefaultAsync<int>(
                "sp_GetUpcomingAppointmentsCount",
                commandType: CommandType.StoredProcedure
            );
            return count;
        }

        public async Task<int> GetTodaysAppointmentsCountAsync()
        {
            using var connection = _dapperContext.CreateConnection();
            var count = await connection.QueryFirstOrDefaultAsync<int>(
                "sp_GetTodaysAppointmentsCount",
                commandType: CommandType.StoredProcedure
            );
            return count;
        }

        public async Task<int> SearchAppointmentsCountAsync(string searchTerm)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@SearchTerm", searchTerm);

            var count = await connection.QueryFirstOrDefaultAsync<int>(
                "sp_SearchAppointmentsCount",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return count;
        }

        public async Task<int> GetAppointmentsByVisitTypeCountAsync(string visitType)
        {
            using var connection = _dapperContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@VisitType", visitType);

            var count = await connection.QueryFirstOrDefaultAsync<int>(
                "sp_GetAppointmentsByVisitTypeCount",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return count;
        }
    }
}

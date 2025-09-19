using MedicalAppointmentSystem.Domain.Models;
using MedicalAppointmentSystem.Domain.ViewModels;

namespace MedicalAppointmentSystem.Application.ServiceInterface
{
    public interface IAppointmentService
    {
        // Basic CRUD operations
        Task<IEnumerable<AppointmentVM>> GetAllAppointmentsAsync(int skip = 0, int take = 50);
        Task<AppointmentVM?> GetAppointmentByIdAsync(int id);
        Task<AppointmentVM> CreateAppointmentAsync(AppointmentCreateVM appointment);
        Task<AppointmentVM?> UpdateAppointmentAsync(AppointmentUpdateVM appointment);
        Task<bool> DeleteAppointmentAsync(int id);
        Task<bool> AppointmentExistsAsync(int id);
        
        // Additional operations
        Task<IEnumerable<AppointmentVM>> GetAppointmentsByPatientIdAsync(int patientId, int skip = 0, int take = 50);
        Task<IEnumerable<AppointmentVM>> GetAppointmentsByDoctorIdAsync(int doctorId, int skip = 0, int take = 50);
        Task<IEnumerable<AppointmentVM>> GetAppointmentsByDateAsync(DateTime date, int skip = 0, int take = 50);
        Task<IEnumerable<AppointmentVM>> GetAppointmentsByDateRangeAsync(DateTime startDate, DateTime endDate, int skip = 0, int take = 50);
        Task<IEnumerable<AppointmentVM>> GetAppointmentsByStatusAsync(string status, int skip = 0, int take = 50);
        Task<IEnumerable<AppointmentVM>> GetUpcomingAppointmentsAsync(int skip = 0, int take = 50);
        Task<IEnumerable<AppointmentVM>> GetTodaysAppointmentsAsync(int skip = 0, int take = 50);
        
        // Search and filter operations
        Task<IEnumerable<AppointmentVM>> SearchAppointmentsAsync(string searchTerm, int skip = 0, int take = 50);
        Task<IEnumerable<AppointmentVM>> GetAppointmentsByVisitTypeAsync(string visitType, int skip = 0, int take = 50);
        
        // Count operations for pagination
        Task<int> GetAppointmentsCountAsync();
        Task<int> GetAppointmentsByPatientIdCountAsync(int patientId);
        Task<int> GetAppointmentsByDoctorIdCountAsync(int doctorId);
        Task<int> GetAppointmentsByDateCountAsync(DateTime date);
        Task<int> GetAppointmentsByDateRangeCountAsync(DateTime startDate, DateTime endDate);
        Task<int> GetAppointmentsByStatusCountAsync(string status);
        Task<int> GetUpcomingAppointmentsCountAsync();
        Task<int> GetTodaysAppointmentsCountAsync();
        Task<int> SearchAppointmentsCountAsync(string searchTerm);
        Task<int> GetAppointmentsByVisitTypeCountAsync(string visitType);
        
        // Status management
        Task<bool> UpdateAppointmentStatusAsync(int id, string status);
        Task<bool> CancelAppointmentAsync(int id);
        Task<bool> CompleteAppointmentAsync(int id);
        
        // Validation operations
        Task<bool> IsDoctorAvailableAsync(int doctorId, DateTime appointmentDate);
        Task<bool> IsTimeSlotAvailableAsync(int doctorId, DateTime appointmentDate);
        Task<IEnumerable<DateTime>> GetAvailableTimeSlotsAsync(int doctorId, DateTime date);
    }
}


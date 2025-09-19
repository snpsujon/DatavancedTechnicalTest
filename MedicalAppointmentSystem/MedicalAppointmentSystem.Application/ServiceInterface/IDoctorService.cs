using MedicalAppointmentSystem.Domain.Models;

namespace MedicalAppointmentSystem.Application.ServiceInterface
{
    public interface IDoctorService
    {
        Task<IEnumerable<Doctor>> GetAllDoctorsAsync();
        Task<Doctor?> GetDoctorByIdAsync(int id);
        Task<Doctor> CreateDoctorAsync(Doctor doctor);
        Task<Doctor?> UpdateDoctorAsync(Doctor doctor);
        Task<bool> DeleteDoctorAsync(int id);
        Task<IEnumerable<Doctor>> SearchDoctorsAsync(string searchTerm);
        Task<IEnumerable<Doctor>> GetDoctorsBySpecializationAsync(string specialization);
        Task<IEnumerable<Doctor>> GetAvailableDoctorsAsync();
        Task<bool> DoctorExistsAsync(int id);
        Task<bool> UpdateDoctorAvailabilityAsync(int id, bool isAvailable);
    }
}

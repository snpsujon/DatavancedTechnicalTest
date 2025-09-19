using MedicalAppointmentSystem.Domain.Models;

namespace MedicalAppointmentSystem.Application.ServiceInterface
{
    public interface IPatientService
    {
        Task<IEnumerable<Patient>> GetAllPatientsAsync();
        Task<Patient?> GetPatientByIdAsync(int id);
        Task<Patient> CreatePatientAsync(Patient patient);
        Task<Patient?> UpdatePatientAsync(Patient patient);
        Task<bool> DeletePatientAsync(int id);
        Task<IEnumerable<Patient>> SearchPatientsAsync(string searchTerm);
        Task<bool> PatientExistsAsync(int id);
    }
}

using MedicalAppointmentSystem.Domain.Models;
using MedicalAppointmentSystem.Domain.ViewModels;

namespace MedicalAppointmentSystem.Application.ServiceInterface
{
    public interface IMedicineService
    {
        // Basic CRUD operations
        Task<IEnumerable<MedicineVM>> GetAllMedicinesAsync(int skip = 0, int take = 50);
        Task<MedicineVM?> GetMedicineByIdAsync(int id);
        Task<MedicineVM> CreateMedicineAsync(Medicine medicine);
        Task<MedicineVM?> UpdateMedicineAsync(Medicine medicine);
        Task<bool> DeleteMedicineAsync(int id);
        Task<bool> MedicineExistsAsync(int id);
        
        // Additional operations
        Task<IEnumerable<MedicineVM>> GetActiveMedicinesAsync(int skip = 0, int take = 50);
        Task<IEnumerable<MedicineVM>> SearchMedicinesAsync(string searchTerm, int skip = 0, int take = 50);
        Task<IEnumerable<MedicineVM>> GetMedicinesByManufacturerAsync(string manufacturer, int skip = 0, int take = 50);
        Task<IEnumerable<MedicineVM>> GetMedicinesByDosageFormAsync(string dosageForm, int skip = 0, int take = 50);
        
        // Count operations for pagination
        Task<int> GetMedicinesCountAsync();
        Task<int> GetActiveMedicinesCountAsync();
        Task<int> SearchMedicinesCountAsync(string searchTerm);
        Task<int> GetMedicinesByManufacturerCountAsync(string manufacturer);
        Task<int> GetMedicinesByDosageFormCountAsync(string dosageForm);
    }
}

using MedicalAppointmentSystem.Domain.Models;
using MedicalAppointmentSystem.Domain.ViewModels;

namespace MedicalAppointmentSystem.Application.ServiceInterface
{
    public interface IPrescriptionService
    {
        // Basic CRUD operations
        Task<IEnumerable<PrescriptionVM>> GetAllPrescriptionsAsync(int skip = 0, int take = 50);
        Task<PrescriptionVM?> GetPrescriptionByIdAsync(int id);
        Task<PrescriptionVM> CreatePrescriptionAsync(PrescriptionCreateVM prescription);
        Task<PrescriptionVM?> UpdatePrescriptionAsync(PrescriptionUpdateVM prescription);
        Task<bool> DeletePrescriptionAsync(int id);
        Task<bool> PrescriptionExistsAsync(int id);
        
        // Appointment-related operations
        Task<PrescriptionVM?> GetPrescriptionByAppointmentIdAsync(int appointmentId);
        Task<PrescriptionVM> CreateOrUpdatePrescriptionForAppointmentAsync(PrescriptionCreateVM prescription);
        
        // Prescription detail operations (Grid operations)
        Task<PrescriptionDetailVM> AddPrescriptionDetailAsync(PrescriptionDetailAddVM prescriptionDetail);
        Task<PrescriptionDetailVM?> UpdatePrescriptionDetailAsync(PrescriptionDetailUpdateVM prescriptionDetail);
        Task<bool> DeletePrescriptionDetailAsync(int prescriptionDetailId);
        Task<IEnumerable<PrescriptionDetailVM>> GetPrescriptionDetailsByPrescriptionIdAsync(int prescriptionId);
        
        // Grid operations
        Task<PrescriptionVM> UpdatePrescriptionGridAsync(PrescriptionGridOperationVM gridOperation);
        Task<bool> AddNewRowToPrescriptionAsync(int prescriptionId, PrescriptionDetailAddVM prescriptionDetail);
        Task<bool> UpdateRowInPrescriptionAsync(PrescriptionDetailUpdateVM prescriptionDetail);
        Task<bool> DeleteRowFromPrescriptionAsync(int prescriptionDetailId);
        
        // Additional operations
        Task<IEnumerable<PrescriptionVM>> GetPrescriptionsByPatientIdAsync(int patientId, int skip = 0, int take = 50);
        Task<IEnumerable<PrescriptionVM>> GetPrescriptionsByDoctorIdAsync(int doctorId, int skip = 0, int take = 50);
        Task<IEnumerable<PrescriptionVM>> GetPrescriptionsByDateRangeAsync(DateTime startDate, DateTime endDate, int skip = 0, int take = 50);
        Task<IEnumerable<PrescriptionVM>> SearchPrescriptionsAsync(string searchTerm, int skip = 0, int take = 50);
        
        // Count operations for pagination
        Task<int> GetPrescriptionsCountAsync();
        Task<int> GetPrescriptionsByPatientIdCountAsync(int patientId);
        Task<int> GetPrescriptionsByDoctorIdCountAsync(int doctorId);
        Task<int> GetPrescriptionsByDateRangeCountAsync(DateTime startDate, DateTime endDate);
        Task<int> SearchPrescriptionsCountAsync(string searchTerm);
        
        // Validation operations
        Task<bool> ValidatePrescriptionDatesAsync(DateTime startDate, DateTime endDate);
        Task<bool> ValidateMedicineExistsAsync(int medicineId);
    }
}

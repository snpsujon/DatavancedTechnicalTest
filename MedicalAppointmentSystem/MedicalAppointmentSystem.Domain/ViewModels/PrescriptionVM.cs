using System.ComponentModel.DataAnnotations;

namespace MedicalAppointmentSystem.Domain.ViewModels
{
    public class MedicineVM
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? GenericName { get; set; }
        public string? DosageForm { get; set; }
        public string? Strength { get; set; }
        public string? Manufacturer { get; set; }
        public string? Description { get; set; }
        public string? Indications { get; set; }
        public string? Contraindications { get; set; }
        public string? SideEffects { get; set; }
        public string? Instructions { get; set; }
    }
    
    public class PrescriptionDetailVM
    {
        public int Id { get; set; }
        public int PrescriptionId { get; set; }
        public int MedicineId { get; set; }
        
        [Required(ErrorMessage = "Dosage is required")]
        [StringLength(200, ErrorMessage = "Dosage cannot exceed 200 characters")]
        public string Dosage { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Start date is required")]
        public DateTime StartDate { get; set; }
        
        [Required(ErrorMessage = "End date is required")]
        public DateTime EndDate { get; set; }
        
        [StringLength(1000, ErrorMessage = "Notes cannot exceed 1000 characters")]
        public string? Notes { get; set; }
        
        // Additional properties for display
        public string? MedicineName { get; set; }
        public string? MedicineGenericName { get; set; }
        public string? MedicineDosageForm { get; set; }
        public string? MedicineStrength { get; set; }
        public string? MedicineManufacturer { get; set; }
    }
    
    public class PrescriptionVM
    {
        public int Id { get; set; }
        public int AppointmentId { get; set; }
        
        [StringLength(1000, ErrorMessage = "General notes cannot exceed 1000 characters")]
        public string? GeneralNotes { get; set; }
        
        [StringLength(1000, ErrorMessage = "Follow-up instructions cannot exceed 1000 characters")]
        public string? FollowUpInstructions { get; set; }
        
        public DateTime PrescriptionDate { get; set; }
        
        // Additional properties for display
        public string? PatientName { get; set; }
        public string? DoctorName { get; set; }
        public string? AppointmentDate { get; set; }
        public string? VisitType { get; set; }
        
        // Grid data
        public List<PrescriptionDetailVM> PrescriptionDetails { get; set; } = new List<PrescriptionDetailVM>();
    }
    
    public class PrescriptionCreateVM
    {
        [Required(ErrorMessage = "Appointment ID is required")]
        public int AppointmentId { get; set; }
        
        [StringLength(1000, ErrorMessage = "General notes cannot exceed 1000 characters")]
        public string? GeneralNotes { get; set; }
        
        [StringLength(1000, ErrorMessage = "Follow-up instructions cannot exceed 1000 characters")]
        public string? FollowUpInstructions { get; set; }
        
        public List<PrescriptionDetailCreateVM> PrescriptionDetails { get; set; } = new List<PrescriptionDetailCreateVM>();
    }
    
    public class PrescriptionDetailCreateVM
    {
        [Required(ErrorMessage = "Medicine is required")]
        public int MedicineId { get; set; }
        
        [Required(ErrorMessage = "Dosage is required")]
        [StringLength(200, ErrorMessage = "Dosage cannot exceed 200 characters")]
        public string Dosage { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Start date is required")]
        public DateTime StartDate { get; set; }
        
        [Required(ErrorMessage = "End date is required")]
        public DateTime EndDate { get; set; }
        
        [StringLength(1000, ErrorMessage = "Notes cannot exceed 1000 characters")]
        public string? Notes { get; set; }
    }
    
    public class PrescriptionUpdateVM
    {
        [Required(ErrorMessage = "Prescription ID is required")]
        public int Id { get; set; }
        
        [Required(ErrorMessage = "Appointment ID is required")]
        public int AppointmentId { get; set; }
        
        [StringLength(1000, ErrorMessage = "General notes cannot exceed 1000 characters")]
        public string? GeneralNotes { get; set; }
        
        [StringLength(1000, ErrorMessage = "Follow-up instructions cannot exceed 1000 characters")]
        public string? FollowUpInstructions { get; set; }
        
        public List<PrescriptionDetailUpdateVM> PrescriptionDetails { get; set; } = new List<PrescriptionDetailUpdateVM>();
    }
    
    public class PrescriptionDetailUpdateVM
    {
        public int Id { get; set; } // 0 for new items
        public int PrescriptionId { get; set; }
        
        [Required(ErrorMessage = "Medicine is required")]
        public int MedicineId { get; set; }
        
        [Required(ErrorMessage = "Dosage is required")]
        [StringLength(200, ErrorMessage = "Dosage cannot exceed 200 characters")]
        public string Dosage { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Start date is required")]
        public DateTime StartDate { get; set; }
        
        [Required(ErrorMessage = "End date is required")]
        public DateTime EndDate { get; set; }
        
        [StringLength(1000, ErrorMessage = "Notes cannot exceed 1000 characters")]
        public string? Notes { get; set; }
        
        public bool IsDeleted { get; set; } = false; // For grid operations
    }
    
    // Grid operation models
    public class PrescriptionGridOperationVM
    {
        public int PrescriptionId { get; set; }
        public List<PrescriptionDetailUpdateVM> PrescriptionDetails { get; set; } = new List<PrescriptionDetailUpdateVM>();
    }
    
    public class PrescriptionDetailAddVM
    {
        public int PrescriptionId { get; set; }
        
        [Required(ErrorMessage = "Medicine is required")]
        public int MedicineId { get; set; }
        
        [Required(ErrorMessage = "Dosage is required")]
        [StringLength(200, ErrorMessage = "Dosage cannot exceed 200 characters")]
        public string Dosage { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Start date is required")]
        public DateTime StartDate { get; set; }
        
        [Required(ErrorMessage = "End date is required")]
        public DateTime EndDate { get; set; }
        
        [StringLength(1000, ErrorMessage = "Notes cannot exceed 1000 characters")]
        public string? Notes { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;

namespace MedicalAppointmentSystem.Domain.ViewModels
{
    public class AppointmentVM
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "Patient is required")]
        public int PatientId { get; set; }
        
        [Required(ErrorMessage = "Doctor is required")]
        public int DoctorId { get; set; }
        
        [Required(ErrorMessage = "Appointment date is required")]
        public DateTime AppointmentDate { get; set; }
        
        [Required(ErrorMessage = "Visit type is required")]
        [StringLength(50, ErrorMessage = "Visit type cannot exceed 50 characters")]
        public string VisitType { get; set; } = string.Empty;
        
        [StringLength(1000, ErrorMessage = "Notes cannot exceed 1000 characters")]
        public string? Notes { get; set; }
        
        [StringLength(2000, ErrorMessage = "Diagnosis cannot exceed 2000 characters")]
        public string? Diagnosis { get; set; }
        
        public string Status { get; set; } = "Scheduled";
        
        // Additional properties for display
        public string? PatientName { get; set; }
        public string? DoctorName { get; set; }
        public string? DoctorSpecialization { get; set; }
    }
    
    public class AppointmentCreateVM
    {
        [Required(ErrorMessage = "Patient is required")]
        public int PatientId { get; set; }
        
        [Required(ErrorMessage = "Doctor is required")]
        public int DoctorId { get; set; }
        
        [Required(ErrorMessage = "Appointment date is required")]
        public DateTime AppointmentDate { get; set; }
        
        [Required(ErrorMessage = "Visit type is required")]
        [StringLength(50, ErrorMessage = "Visit type cannot exceed 50 characters")]
        public string VisitType { get; set; } = string.Empty;
        
        [StringLength(1000, ErrorMessage = "Notes cannot exceed 1000 characters")]
        public string? Notes { get; set; }
        
        [StringLength(2000, ErrorMessage = "Diagnosis cannot exceed 2000 characters")]
        public string? Diagnosis { get; set; }
    }
    
    public class AppointmentUpdateVM
    {
        [Required(ErrorMessage = "Appointment ID is required")]
        public int Id { get; set; }
        
        [Required(ErrorMessage = "Patient is required")]
        public int PatientId { get; set; }
        
        [Required(ErrorMessage = "Doctor is required")]
        public int DoctorId { get; set; }
        
        [Required(ErrorMessage = "Appointment date is required")]
        public DateTime AppointmentDate { get; set; }
        
        [Required(ErrorMessage = "Visit type is required")]
        [StringLength(50, ErrorMessage = "Visit type cannot exceed 50 characters")]
        public string VisitType { get; set; } = string.Empty;
        
        [StringLength(1000, ErrorMessage = "Notes cannot exceed 1000 characters")]
        public string? Notes { get; set; }
        
        [StringLength(2000, ErrorMessage = "Diagnosis cannot exceed 2000 characters")]
        public string? Diagnosis { get; set; }
        
        [StringLength(50, ErrorMessage = "Status cannot exceed 50 characters")]
        public string Status { get; set; } = "Scheduled";
    }
}


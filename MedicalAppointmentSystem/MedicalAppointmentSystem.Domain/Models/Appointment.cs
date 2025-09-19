using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MedicalAppointmentSystem.Domain.Models
{
    [Table("Appointments")]
    public class Appointment
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int PatientId { get; set; }
        
        [Required]
        public int DoctorId { get; set; }
        
        [Required]
        public DateTime AppointmentDate { get; set; }
        
        [Required]
        [StringLength(50)]
        public string VisitType { get; set; } = string.Empty; // First Visit, Follow-up, etc.
        
        [StringLength(1000)]
        public string? Notes { get; set; }
        
        [StringLength(2000)]
        public string? Diagnosis { get; set; }
        
        [StringLength(50)]
        public string Status { get; set; } = "Scheduled"; // Scheduled, Completed, Cancelled, No-Show
        
        [StringLength(100)]
        public string? CreatedBy { get; set; }
        
        [StringLength(100)]
        public string? UpdatedBy { get; set; }
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedDate { get; set; }
        
        // Navigation properties
        [ForeignKey("PatientId")]
        public virtual Patient? Patient { get; set; }
        
        [ForeignKey("DoctorId")]
        public virtual Doctor? Doctor { get; set; }
    }
}


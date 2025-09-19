using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MedicalAppointmentSystem.Domain.Models
{
    [Table("Prescriptions")]
    public class Prescription
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int AppointmentId { get; set; }
        
        [StringLength(1000)]
        public string? GeneralNotes { get; set; }
        
        [StringLength(1000)]
        public string? FollowUpInstructions { get; set; }
        
        public DateTime PrescriptionDate { get; set; } = DateTime.UtcNow;
        
        [StringLength(100)]
        public string? CreatedBy { get; set; }
        
        [StringLength(100)]
        public string? UpdatedBy { get; set; }
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedDate { get; set; }
        
        // Navigation properties
        [ForeignKey("AppointmentId")]
        public virtual Appointment? Appointment { get; set; }
        
        public virtual ICollection<PrescriptionDetail> PrescriptionDetails { get; set; } = new List<PrescriptionDetail>();
    }
    
    [Table("PrescriptionDetails")]
    public class PrescriptionDetail
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int PrescriptionId { get; set; }
        
        [Required]
        public int MedicineId { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Dosage { get; set; } = string.Empty; // e.g., "2x daily"
        
        [Required]
        public DateTime StartDate { get; set; }
        
        [Required]
        public DateTime EndDate { get; set; }
        
        [StringLength(1000)]
        public string? Notes { get; set; } // Editable text cell
        
        [StringLength(100)]
        public string? CreatedBy { get; set; }
        
        [StringLength(100)]
        public string? UpdatedBy { get; set; }
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedDate { get; set; }
        
        // Navigation properties
        [ForeignKey("PrescriptionId")]
        public virtual Prescription? Prescription { get; set; }
        
        [ForeignKey("MedicineId")]
        public virtual Medicine? Medicine { get; set; }
    }
}

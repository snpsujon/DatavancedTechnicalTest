using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MedicalAppointmentSystem.Domain.Models
{
    [Table("Patients")]
    public class Patient
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string FirstName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string LastName { get; set; } = string.Empty;
        
        [StringLength(200)]
        public string? Email { get; set; }
        
        [StringLength(20)]
        public string? PhoneNumber { get; set; }
        
        [StringLength(500)]
        public string? Address { get; set; }
        
        public DateTime? DateOfBirth { get; set; }
        
        [StringLength(10)]
        public string? Gender { get; set; }
        
        [StringLength(500)]
        public string? MedicalHistory { get; set; }
        
        [StringLength(500)]
        public string? Allergies { get; set; }
        
        [StringLength(500)]
        public string? EmergencyContactName { get; set; }
        
        [StringLength(20)]
        public string? EmergencyContactPhone { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedDate { get; set; }
        
        [StringLength(100)]
        public string? CreatedBy { get; set; }
        
        [StringLength(100)]
        public string? UpdatedBy { get; set; }
    }
}

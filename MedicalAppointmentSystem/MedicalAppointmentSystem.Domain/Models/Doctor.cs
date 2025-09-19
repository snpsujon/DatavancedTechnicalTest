using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MedicalAppointmentSystem.Domain.Models
{
    [Table("Doctors")]
    public class Doctor
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
        
        [Required]
        [StringLength(100)]
        public string Specialization { get; set; } = string.Empty;
        
        [StringLength(50)]
        public string? LicenseNumber { get; set; }
        
        [StringLength(100)]
        public string? Qualification { get; set; }
        
        public int? YearsOfExperience { get; set; }
        
        [StringLength(500)]
        public string? Bio { get; set; }
        
        [StringLength(200)]
        public string? ProfileImageUrl { get; set; }
        
        [StringLength(100)]
        public string? Department { get; set; }
        
        public TimeSpan? AvailableFrom { get; set; }
        
        public TimeSpan? AvailableTo { get; set; }
        
        [StringLength(500)]
        public string? ConsultationFee { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public bool IsAvailable { get; set; } = true;
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedDate { get; set; }
        
        [StringLength(100)]
        public string? CreatedBy { get; set; }
        
        [StringLength(100)]
        public string? UpdatedBy { get; set; }
    }
}

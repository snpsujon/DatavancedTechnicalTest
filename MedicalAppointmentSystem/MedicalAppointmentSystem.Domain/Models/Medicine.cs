using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MedicalAppointmentSystem.Domain.Models
{
    [Table("Medicines")]
    public class Medicine
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string? GenericName { get; set; }
        
        [StringLength(50)]
        public string? DosageForm { get; set; } // Tablet, Syrup, Injection, etc.
        
        [StringLength(20)]
        public string? Strength { get; set; } // 500mg, 10ml, etc.
        
        [StringLength(100)]
        public string? Manufacturer { get; set; }
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        [StringLength(1000)]
        public string? Indications { get; set; } // What it's used for
        
        [StringLength(1000)]
        public string? Contraindications { get; set; } // When not to use
        
        [StringLength(1000)]
        public string? SideEffects { get; set; }
        
        [StringLength(1000)]
        public string? Instructions { get; set; } // General instructions
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedDate { get; set; }
        
        [StringLength(100)]
        public string? CreatedBy { get; set; }
        
        [StringLength(100)]
        public string? UpdatedBy { get; set; }
    }
}

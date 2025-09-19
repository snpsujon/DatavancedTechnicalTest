using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace MedicalAppointmentSystem.Domain.Models
{
    public class ApplicationDbUser : IdentityUser
    {
        public string? userFName { get; set; }
        public string? userLName { get; set; }
        public string? mobile { get; set; }
        public bool? status { get; set; } = true;
        public string? profileImageUrl { get; set; }
        public string? createdBy { get; set; }
        public string? updatedBy { get; set; }
        public DateTime? createdAt { get; set; }
        public DateTime? updatedAt { get; set; }
        public int? userTypeId { get; set; }
        public int? userStatusId { get; set; }
        public DateTime? dateOfBirth { get; set; }

        public int? genderId { get; set; }

        public int? designationId { get; set; }

        public int? distributerId { get; set; }
        public int? regionId { get; set; }
        public int? shiftId { get; set; }
        public override string? Email { get; set; } // Allow null

        [NotMapped]
        public string password { get; set; } = null!;
    }
}

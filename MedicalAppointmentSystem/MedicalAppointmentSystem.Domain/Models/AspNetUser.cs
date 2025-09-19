using System.ComponentModel.DataAnnotations.Schema;

namespace MedicalAppointmentSystem.Domain.Models
{
    public class AspNetUser
    {
        public string Id { get; set; } = null!;

        public string? UserFName { get; set; }

        public string? UserLName { get; set; }

        public string? Mobile { get; set; }

        public bool IsActive { get; set; }

        public string? ProfileImageUrl { get; set; }

        public string? CreatedBy { get; set; }

        public string? UpdatedBy { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public string? UserName { get; set; }

        public string? NormalizedUserName { get; set; }

        public string? Email { get; set; }

        public string? NormalizedEmail { get; set; }

        public bool EmailConfirmed { get; set; }

        public string? PasswordHash { get; set; }

        public string? SecurityStamp { get; set; }

        public string? ConcurrencyStamp { get; set; }

        public string? PhoneNumber { get; set; }

        public bool PhoneNumberConfirmed { get; set; }


        public bool TwoFactorEnabled { get; set; }

        public DateTimeOffset? LockoutEnd { get; set; }

        public bool LockoutEnabled { get; set; }

        public int AccessFailedCount { get; set; }
        public DateTime? dateOfBirth { get; set; }

        public int? genderId { get; set; }

        public int? designationId { get; set; }

        public virtual ICollection<AspNetUserClaim> AspNetUserClaims { get; set; } = new List<AspNetUserClaim>();

        public virtual ICollection<AspNetUserLogin> AspNetUserLogins { get; set; } = new List<AspNetUserLogin>();

        public virtual ICollection<AspNetUserToken> AspNetUserTokens { get; set; } = new List<AspNetUserToken>();

        public virtual ICollection<AspNetRole> Roles { get; set; } = new List<AspNetRole>();

        [NotMapped]
        public string Password { get; set; } = null!;
        [NotMapped]
        public string UserRoleId { get; set; } = null!;

    }
}

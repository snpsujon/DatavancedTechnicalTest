using MedicalAppointmentSystem.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
namespace MedicalAppointmentSystem.Infrastructure.DBContext
{
    public partial class EFContext : DbContext
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;
        private readonly string _dbCon;
        private readonly bool _isdev;
        public EFContext(DbContextOptions<EFContext> options, IConfiguration configuration)
            : base(options)
        {
            _configuration = configuration;
            _isdev = _configuration.GetValue<bool>("IsDevelopment");
            _dbCon = _isdev ? "DevConnection" : "DevConnectionProduction";
            _connectionString = _configuration.GetConnectionString(_dbCon);
        }

        public virtual DbSet<MenuPermission> MenuPermissions { get; set; }
        public virtual DbSet<AspNetRole> AspNetRoles { get; set; }
        public virtual DbSet<MedicalAppointmentSystemMenu> IMSMenus { get; set; }
        public virtual DbSet<Patient> Patients { get; set; }
        public virtual DbSet<Doctor> Doctors { get; set; }

        public virtual DbSet<AspNetRoleClaim> AspNetRoleClaims { get; set; }

        public virtual DbSet<AspNetUser> AspNetUsers { get; set; }

        public virtual DbSet<AspNetUserClaim> AspNetUserClaims { get; set; }

        public virtual DbSet<AspNetUserLogin> AspNetUserLogins { get; set; }

        public virtual DbSet<AspNetUserToken> AspNetUserTokens { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
            => optionsBuilder.UseSqlServer(_connectionString);

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AspNetRole>(entity =>
            {
                entity.HasIndex(e => e.NormalizedName, "RoleNameIndex")
                    .IsUnique()
                    .HasFilter("([NormalizedName] IS NOT NULL)");

                entity.Property(e => e.Name).HasMaxLength(256);
                entity.Property(e => e.NormalizedName).HasMaxLength(256);
            });
            modelBuilder.Entity<MenuPermission>(entity =>
            {
                entity.ToTable("MenuPermission");
            });
            modelBuilder.Entity<MedicalAppointmentSystemMenu>(entity =>
            {
                entity.ToTable("IMSMenus"); // Specify table name if it doesn't match the class name
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Title).HasMaxLength(255).IsRequired();
                entity.Property(e => e.Type).HasMaxLength(50).IsRequired();
                entity.Property(e => e.Url).HasMaxLength(500).IsRequired();
                entity.Property(e => e.Icon).HasMaxLength(255).IsRequired();
                entity.Property(e => e.Classes).HasMaxLength(255);
            });

            modelBuilder.Entity<AspNetRoleClaim>(entity =>
            {
                entity.HasIndex(e => e.RoleId, "IX_AspNetRoleClaims_RoleId");

                entity.HasOne(d => d.Role).WithMany(p => p.AspNetRoleClaims).HasForeignKey(d => d.RoleId);
            });

            modelBuilder.Entity<AspNetUser>(entity =>
            {
                entity.HasIndex(e => e.NormalizedEmail, "EmailIndex");

                entity.HasIndex(e => e.NormalizedUserName, "UserNameIndex")
                    .IsUnique()
                    .HasFilter("([NormalizedUserName] IS NOT NULL)");

                entity.Property(e => e.Email).HasMaxLength(256);
                entity.Property(e => e.NormalizedEmail).HasMaxLength(256);
                entity.Property(e => e.NormalizedUserName).HasMaxLength(256);
                entity.Property(e => e.UserName).HasMaxLength(256);

                entity.HasMany(d => d.Roles).WithMany(p => p.Users)
                    .UsingEntity<Dictionary<string, object>>(
                        "AspNetUserRole",
                        r => r.HasOne<AspNetRole>().WithMany().HasForeignKey("RoleId"),
                        l => l.HasOne<AspNetUser>().WithMany().HasForeignKey("UserId"),
                        j =>
                        {
                            j.HasKey("UserId", "RoleId");
                            j.ToTable("AspNetUserRoles");
                            j.HasIndex(new[] { "RoleId" }, "IX_AspNetUserRoles_RoleId");
                        });
            });


            modelBuilder.Entity<AspNetUserClaim>(entity =>
            {
                entity.HasIndex(e => e.UserId, "IX_AspNetUserClaims_UserId");

                entity.HasOne(d => d.User).WithMany(p => p.AspNetUserClaims).HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<AspNetUserLogin>(entity =>
            {
                entity.HasKey(e => new { e.LoginProvider, e.ProviderKey });

                entity.HasIndex(e => e.UserId, "IX_AspNetUserLogins_UserId");

                entity.HasOne(d => d.User).WithMany(p => p.AspNetUserLogins).HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<AspNetUserToken>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.LoginProvider, e.Name });

                entity.HasOne(d => d.User).WithMany(p => p.AspNetUserTokens).HasForeignKey(d => d.UserId);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}

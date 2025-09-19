
using MedicalAppointmentSystem.Domain.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;



namespace MedicalAppointmentSystem.Infrastructure.DBContext
{
    public class IdentityContext : IdentityDbContext<ApplicationDbUser>
    {

        public IdentityContext()
        {

        }
        public IdentityContext(DbContextOptions<IdentityContext> options)
            : base(options)
        {
        }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Server=203.26.151.51;User Id=sa;Password=A$df019lkjh#;Database=MedicalAppointmentSystem; Persist Security Info=true; TrustServerCertificate=true;Trusted_Connection=false;");
                //optionsBuilder.UseSqlServer("Server=10.1.205.19;User Id=sa;Password=P@ssw0rd;Database=RMMS; Persist Security Info=true; TrustServerCertificate=true;Trusted_Connection=false;");


            }
        }
    }
}

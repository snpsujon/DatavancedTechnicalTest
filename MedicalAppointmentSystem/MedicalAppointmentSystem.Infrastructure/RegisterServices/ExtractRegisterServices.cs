using Microsoft.Extensions.DependencyInjection;
using MedicalAppointmentSystem.Application.ServiceInterface;
using MedicalAppointmentSystem.Infrastructure.ServiceRepository;

namespace MedicalAppointmentSystem.Infrastructure.RegisterServices
{
    public static class ExtractRegisterServices
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services)
        {
            // Register Patient Service
            services.AddScoped<IPatientService, PatientService>();
            
            // Register Doctor Service
            services.AddScoped<IDoctorService, DoctorService>();
            
            // Register Appointment Service
            services.AddScoped<IAppointmentService, AppointmentService>();
            
            // Register Medicine Service
            services.AddScoped<IMedicineService, MedicineService>();
            
            // Register Prescription Service
            services.AddScoped<IPrescriptionService, PrescriptionService>();
            
            //services.AddScoped<ICloudStorageService, AWSFileStorageService>();
            return services;
        }
    }
}

namespace MedicalAppointmentSystem.Domain.ViewModels
{
    public class SettingsVM
    {
        public int id { get; set; }
        public string? name { get; set; }
        public string? userId { get; set; }
        public bool? isActive { get; set; }

    }

    public class DeleteVM
    {
        public int id { get; set; }
        public string? userId { get; set; }
    }
    public class CreditLimitVM
    {
        public int id { get; set; }
        public decimal? days { get; set; }
        public decimal? amount { get; set; }
        public bool? isActive { get; set; }
    }

}

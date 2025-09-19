namespace MedicalAppointmentSystem.Domain.Models
{
    public class VisitPlanSubmitVM
    {
        public int? visitDetailId { get; set; }
        public int? visitTypeId { get; set; }
        public DateTime? visitedDate { get; set; }
        public string? remarks { get; set; }
        public string? userId { get; set; }
        public decimal? visitedLat { get; set; }
        public decimal? visitedLon { get; set; }
        public int? doctorChamberId { get; set; }
        public List<SampleFromVisitDetailsVM>? sampleFromVisitDetails { get; set; }
        public List<PromoGiftFromVisitDetailsVM>? promoGiftFromVisitDetails { get; set; }
        public List<BrandFromVisitDetailsVM>? brandFromVisitDetails { get; set; }
    }

    public class SampleFromVisitDetailsVM
    {
        public int? productId { get; set; }
        public int? qty { get; set; }
    }

    public class PromoGiftFromVisitDetailsVM
    {
        public int? productId { get; set; }
        public int? qty { get; set; }
    }

    public class BrandFromVisitDetailsVM
    {
        public int? brandId { get; set; }
    }
}

namespace MedicalAppointmentSystem.Domain.Models
{
    public class MenuPermission
    {
        public int id { get; set; }

        public int? menuId { get; set; }

        public string? roleId { get; set; }

        public bool? isView { get; set; }

        public bool? isDetails { get; set; }

        public bool? isAdd { get; set; }

        public bool? isEdit { get; set; }

        public bool? isDelete { get; set; }

        public bool? active { get; set; }

        public bool? isDeleted { get; set; }

        public string? createdBy { get; set; }

        public DateTime? createdAt { get; set; }

        public string? updatedBy { get; set; }

        public DateTime? updatedAt { get; set; }
    }
}

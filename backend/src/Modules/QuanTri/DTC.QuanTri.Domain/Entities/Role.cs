using DTC.Shared.Domain;
using System.Collections.Generic;

namespace DTC.QuanTri.Domain.Entities
{
    public class Role : BaseEntity
    {
        public string? MaNhom { get; set; }
        public string? Tennhom { get; set; }
        public string? MoTa { get; set; }
        public int? DonViID { get; set; }
        public bool? HieuLuc { get; set; }
        
        // Phân quyền đặc thù Vụ (Cloned from QT_NhomNguoiDung)
        public int? LoaiNhom { get; set; }
        public bool? LaVuNganh { get; set; }
        public bool? LaVuDonVi { get; set; }
        public bool? LaVuKinhTeDoiNgoai { get; set; }
        public bool? LaVuTHKTQD { get; set; }
        public bool? LaVuTCTT { get; set; }

        public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    }
}

using DTC.Shared.Domain;
using System;
using System.Collections.Generic;

namespace DTC.QuanTri.Domain.Entities
{
    public class User : BaseEntity
    {
        public int? DonViID { get; set; }
        public int? DonViTrucThuocID { get; set; }
        public int? DonViCapTrenID { get; set; }
        public int? NhomNguoiDungID { get; set; }
        
        public string? UserName { get; set; }
        public string? Hoten { get; set; }
        public bool? Hieuluc { get; set; }
        public string? Dienthoai { get; set; }
        public string? Email { get; set; }
        public string? Ghichu { get; set; }
        
        // Security
        public string? PasswordHash { get; set; }
        public string? SecretKey2FA { get; set; }
        public bool BitUsingSecretKey2FA { get; set; }
        
        // Phân quyền đặc thù theo nghiệp vụ cũ (Cloned from QT_NguoiSuDung)
        public bool? LaLanhDao { get; set; }
        public bool? LaAdmin { get; set; }
        public bool? FullQuyenTHKTQD { get; set; }
        public bool? QuyenTHKTQDDiaPhuong { get; set; }
        public bool? QuyenTHKTQDCacVu { get; set; }
        public bool? FullQuyenCTMT { get; set; }
        public bool? FullQuyenNganh { get; set; }
        public bool? FullQuyenXemTHKTQD { get; set; }
        public bool? QuyenKinhTeDoiNgoai { get; set; }
        public bool? QuyenKhoaDuLieu { get; set; }
        public bool? QuyenVuTHKTQDTraVe { get; set; }
        public bool? QuyenVuPTDonViTraVe { get; set; }
        public bool? QuyenVuPTNganhFullDonVi { get; set; }
        public bool? QuyenFullTaiLieu { get; set; }
        public bool? QuyenChuyenLapKHSangKHHN { get; set; }

        public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    }
}

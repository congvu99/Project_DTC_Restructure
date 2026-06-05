using DTC.Shared.Domain;

namespace DTC.QuanTri.Domain.Entities
{
    public class UserRole : BaseEntity
    {
        public int NguoiDungID { get; set; }
        public virtual User User { get; set; }

        public int NhomNguoiDungID { get; set; }
        public virtual Role Role { get; set; }
        
        public bool HieuLuc { get; set; }
    }
}

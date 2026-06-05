using System;

namespace DTC.Shared.Domain
{
    public abstract class BaseEntity<TId>
    {
        public TId Id { get; set; }
        
        // Cấu trúc Audit theo chuẩn Database cũ của DTC
        public DateTime? NgayTao { get; set; }
        public int? NguoiTao { get; set; }
        public DateTime? NgaySua { get; set; }
        public int? NguoiSua { get; set; }
        public bool BitDaXoa { get; set; } = false;
    }
    
    // Default int
    public abstract class BaseEntity : BaseEntity<int> { }
}

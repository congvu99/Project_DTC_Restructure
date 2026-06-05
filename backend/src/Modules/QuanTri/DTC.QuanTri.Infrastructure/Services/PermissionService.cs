using Dapper;
using DTC.QuanTri.Application.Interfaces;
using DTC.Shared.Application.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Threading.Tasks;

namespace DTC.QuanTri.Infrastructure.Services
{
    public class PermissionService : IPermissionService
    {
        private readonly IDbConnectionFactory _connectionFactory;
        private readonly IMemoryCache _cache;

        public PermissionService(IDbConnectionFactory connectionFactory, IMemoryCache cache)
        {
            _connectionFactory = connectionFactory;
            _cache = cache;
        }

        public async Task<bool> HasPermissionAsync(int userId, string maChucNang, string maQuyen)
        {
            // Sử dụng MemoryCache để tối ưu: Key format = "Permission_{userId}_{maChucNang}_{maQuyen}"
            string cacheKey = $"Permission_{userId}_{maChucNang}_{maQuyen}";

            if (_cache.TryGetValue(cacheKey, out bool hasPermission))
            {
                return hasPermission;
            }

            // Dapper Query để check quyền từ các bảng hệ thống cũ
            string sql = @"
                SELECT TOP 1 1 
                FROM dbo.QT_NhomNguoiDung_NguoiDung nnd_nd
                INNER JOIN dbo.QT_NhomNguoiDung_QuyenChucNang nnd_qcn ON nnd_nd.NhomNguoiDungID = nnd_qcn.NhomNguoiDungID
                INNER JOIN dbo.QT_ChucNang cn ON nnd_qcn.ChucNangID = cn.ID
                INNER JOIN dbo.QT_Quyen q ON nnd_qcn.QuyenID = q.ID
                WHERE nnd_nd.NguoiDungID = @UserId 
                  AND cn.Code = @MaChucNang 
                  AND q.MaQuyen = @MaQuyen
                  AND ISNULL(nnd_nd.BitDaXoa, 0) = 0 
                  AND ISNULL(cn.BitDaXoa, 0) = 0";

            using var connection = _connectionFactory.CreateConnection();
            var result = await connection.QueryFirstOrDefaultAsync<int?>(sql, new { UserId = userId, MaChucNang = maChucNang, MaQuyen = maQuyen });

            hasPermission = result.HasValue;

            // Lưu vào Cache trong 10 phút
            var cacheOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromMinutes(10));
                
            _cache.Set(cacheKey, hasPermission, cacheOptions);

            return hasPermission;
        }
    }
}

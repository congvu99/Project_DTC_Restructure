using Dapper;
using DTC.QuanTri.Domain.Entities;
using DTC.QuanTri.Domain.Repositories;
using DTC.Shared.Application.Interfaces;
using DTC.Shared.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DTC.QuanTri.Infrastructure.Persistence.Repositories
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(QuanTriDbContext dbContext, IDbConnectionFactory connectionFactory) 
            : base(dbContext, connectionFactory)
        {
        }

        // ==========================================
        // Sử dụng Entity Framework Core
        // ==========================================
        public async Task<User> GetByUsernameAsync(string username)
        {
            return await _dbSet
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => (u.UserName == username || u.UserName.EndsWith("\\" + username)) && !u.BitDaXoa);
        }

        public async Task<IEnumerable<User>> GetActiveUsersByDonViAsync(int donViId)
        {
            return await _dbSet
                .Where(u => u.DonViID == donViId && u.Hieuluc == true && !u.BitDaXoa)
                .ToListAsync();
        }

        // ==========================================
        // Sử dụng Dapper
        // ==========================================
        public async Task<(IEnumerable<dynamic> Items, int TotalCount)> GetUserRolesReportAsync(int skip, int take, string? keyword = null, bool? hieuluc = null)
        {
            string sql = @"
                SELECT COUNT(1)
                FROM dbo.QT_NguoiSuDung u
                WHERE u.BitDaXoa = 0
                AND (@Keyword IS NULL OR (u.UserName LIKE '%' + @Keyword + '%' OR u.Hoten LIKE '%' + @Keyword + '%' OR u.Email LIKE '%' + @Keyword + '%'))
                AND (@Hieuluc IS NULL OR u.Hieuluc = @Hieuluc);

                SELECT 
                    u.ID,
                    u.UserName, 
                    u.Hoten, 
                    u.Email,
                    u.Dienthoai,
                    u.Hieuluc
                FROM dbo.QT_NguoiSuDung u
                WHERE u.BitDaXoa = 0
                AND (@Keyword IS NULL OR (u.UserName LIKE '%' + @Keyword + '%' OR u.Hoten LIKE '%' + @Keyword + '%' OR u.Email LIKE '%' + @Keyword + '%'))
                AND (@Hieuluc IS NULL OR u.Hieuluc = @Hieuluc)
                ORDER BY u.ID DESC
                OFFSET @Skip ROWS FETCH NEXT @Take ROWS ONLY;";

            using var connection = _connectionFactory.CreateConnection();
            using var multi = await connection.QueryMultipleAsync(sql, new { 
                Skip = skip, 
                Take = take, 
                Keyword = keyword, 
                Hieuluc = hieuluc 
            });
            
            var totalCount = await multi.ReadFirstAsync<int>();
            var items = await multi.ReadAsync<dynamic>();

            return (items, totalCount);
        }
    }
}

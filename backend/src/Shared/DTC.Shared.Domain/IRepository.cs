using System.Collections.Generic;
using System.Threading.Tasks;

namespace DTC.Shared.Domain.Interfaces
{
    public interface IRepository<TEntity> where TEntity : class
    {
        // === COMMANDS (Thường dùng Entity Framework Core) ===
        Task<TEntity> GetByIdAsync(object id);
        Task<TEntity> AddAsync(TEntity entity);
        Task UpdateAsync(TEntity entity);
        Task DeleteAsync(TEntity entity);
        Task<int> SaveChangesAsync();

        // === QUERIES (Thường dùng Dapper cho hiệu năng hoặc gọi Stored Procedures cũ) ===
        Task<IEnumerable<T>> QueryAsync<T>(string sql, object parameters = null);
        Task<T> QueryFirstOrDefaultAsync<T>(string sql, object parameters = null);
        Task<IEnumerable<T>> QueryStoredProcedureAsync<T>(string storedProcedureName, object parameters = null);
    }
}

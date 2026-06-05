using Dapper;
using DTC.Shared.Application.Interfaces;
using DTC.Shared.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace DTC.Shared.Infrastructure.Persistence
{
    public abstract class BaseRepository<TEntity> : IRepository<TEntity> where TEntity : class
    {
        protected readonly DbContext _dbContext;
        protected readonly DbSet<TEntity> _dbSet;
        protected readonly IDbConnectionFactory _connectionFactory;

        protected BaseRepository(DbContext dbContext, IDbConnectionFactory connectionFactory)
        {
            _dbContext = dbContext;
            _dbSet = dbContext.Set<TEntity>();
            _connectionFactory = connectionFactory;
        }

        // === ENTITY FRAMEWORK CORE (CUD operations & simple tracking reads) ===

        public virtual async Task<TEntity> GetByIdAsync(object id)
        {
            return await _dbSet.FindAsync(id);
        }

        public virtual async Task<TEntity> AddAsync(TEntity entity)
        {
            await _dbSet.AddAsync(entity);
            return entity;
        }

        public virtual Task UpdateAsync(TEntity entity)
        {
            _dbContext.Entry(entity).State = EntityState.Modified;
            return Task.CompletedTask;
        }

        public virtual Task DeleteAsync(TEntity entity)
        {
            _dbSet.Remove(entity);
            return Task.CompletedTask;
        }

        public virtual async Task<int> SaveChangesAsync()
        {
            return await _dbContext.SaveChangesAsync();
        }

        // === DAPPER (Complex queries, fast reads, and 591+ legacy Stored Procedures) ===

        public virtual async Task<IEnumerable<T>> QueryAsync<T>(string sql, object parameters = null)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<T>(sql, parameters);
        }

        public virtual async Task<T> QueryFirstOrDefaultAsync<T>(string sql, object parameters = null)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<T>(sql, parameters);
        }

        public virtual async Task<IEnumerable<T>> QueryStoredProcedureAsync<T>(string storedProcedureName, object parameters = null)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<T>(
                storedProcedureName, 
                parameters, 
                commandType: CommandType.StoredProcedure);
        }
    }
}

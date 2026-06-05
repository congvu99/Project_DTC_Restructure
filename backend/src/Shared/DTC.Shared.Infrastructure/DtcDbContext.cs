using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace DTC.Shared.Infrastructure.Persistence
{
    public abstract class DtcDbContext : DbContext
    {
        protected DtcDbContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Tự động apply các IEntityTypeConfiguration
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }
    }
}

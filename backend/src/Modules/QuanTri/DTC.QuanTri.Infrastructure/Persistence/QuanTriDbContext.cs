using DTC.QuanTri.Domain.Entities;
using DTC.Shared.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace DTC.QuanTri.Infrastructure.Persistence
{
    public class QuanTriDbContext : DtcDbContext
    {
        public QuanTriDbContext(DbContextOptions<QuanTriDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Cấu hình Schema dbo vì DB cũ đang ở dbo
            modelBuilder.HasDefaultSchema("dbo");

            // Mapping chuẩn xác với Database Cũ
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("QT_NguoiSuDung");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("ID");
            });

            modelBuilder.Entity<Role>(entity =>
            {
                entity.ToTable("QT_NhomNguoiDung");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("ID");
            });

            modelBuilder.Entity<UserRole>(entity =>
            {
                entity.ToTable("QT_NhomNguoiDung_NguoiDung");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.HasOne(ur => ur.User)
                      .WithMany(u => u.UserRoles)
                      .HasForeignKey(ur => ur.NguoiDungID);

                entity.HasOne(ur => ur.Role)
                      .WithMany(r => r.UserRoles)
                      .HasForeignKey(ur => ur.NhomNguoiDungID);
            });
        }
    }
}

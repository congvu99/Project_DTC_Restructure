using DTC.QuanTri.Domain.Entities;
using DTC.Shared.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DTC.QuanTri.Domain.Repositories
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User> GetByUsernameAsync(string username);
        Task<IEnumerable<User>> GetActiveUsersByDonViAsync(int donViId);
        
        // Phương thức này sẽ tận dụng Dapper ở lớp Infrastructure
        Task<(IEnumerable<dynamic> Items, int TotalCount)> GetUserRolesReportAsync(int skip, int take, string? keyword = null, bool? hieuluc = null); 
    }
}

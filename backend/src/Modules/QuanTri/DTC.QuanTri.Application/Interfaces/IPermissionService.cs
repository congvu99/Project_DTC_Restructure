using System.Threading.Tasks;

namespace DTC.QuanTri.Application.Interfaces
{
    public interface IPermissionService
    {
        Task<bool> HasPermissionAsync(int userId, string maChucNang, string maQuyen);
    }
}

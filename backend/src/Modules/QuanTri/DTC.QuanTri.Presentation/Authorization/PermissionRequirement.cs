using Microsoft.AspNetCore.Authorization;

namespace DTC.QuanTri.Presentation.Authorization
{
    public class PermissionRequirement : IAuthorizationRequirement
    {
        public string MaChucNang { get; }
        public string MaQuyen { get; }

        public PermissionRequirement(string maChucNang, string maQuyen)
        {
            MaChucNang = maChucNang;
            MaQuyen = maQuyen;
        }
    }
}

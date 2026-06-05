using DTC.QuanTri.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;

namespace DTC.QuanTri.Presentation.Authorization
{
    public class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
    {
        private readonly IPermissionService _permissionService;

        public PermissionAuthorizationHandler(IPermissionService permissionService)
        {
            _permissionService = permissionService;
        }

        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
        {
            var userIdClaim = context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return;
            }

            if (!int.TryParse(userIdClaim.Value, out int userId))
            {
                return;
            }

            bool hasPermission = await _permissionService.HasPermissionAsync(userId, requirement.MaChucNang, requirement.MaQuyen);

            if (hasPermission)
            {
                context.Succeed(requirement);
            }
            else
            {
                context.Fail();
            }
        }
    }
}

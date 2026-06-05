using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace DTC.QuanTri.Presentation.Authorization
{
    public class PermissionPolicyProvider : IAuthorizationPolicyProvider
    {
        public DefaultAuthorizationPolicyProvider FallbackPolicyProvider { get; }

        public PermissionPolicyProvider(IOptions<AuthorizationOptions> options)
        {
            FallbackPolicyProvider = new DefaultAuthorizationPolicyProvider(options);
        }

        public Task<AuthorizationPolicy> GetDefaultPolicyAsync() => FallbackPolicyProvider.GetDefaultPolicyAsync();
        
        public Task<AuthorizationPolicy?> GetFallbackPolicyAsync() => FallbackPolicyProvider.GetFallbackPolicyAsync();

        public Task<AuthorizationPolicy?> GetPolicyAsync(string policyName)
        {
            if (policyName.StartsWith(HasPermissionAttribute.PolicyPrefix, System.StringComparison.OrdinalIgnoreCase))
            {
                // policyName = "HasPermission_QuanLyNguoiDung_Xem"
                var parts = policyName.Substring(HasPermissionAttribute.PolicyPrefix.Length).Split('_');
                if (parts.Length >= 2)
                {
                    string maChucNang = parts[0];
                    string maQuyen = parts[1];

                    var policy = new AuthorizationPolicyBuilder()
                        .AddRequirements(new PermissionRequirement(maChucNang, maQuyen))
                        .Build();

                    return Task.FromResult<AuthorizationPolicy?>(policy);
                }
            }

            // Trả về policy mặc định nếu không khớp
            return FallbackPolicyProvider.GetPolicyAsync(policyName);
        }
    }
}

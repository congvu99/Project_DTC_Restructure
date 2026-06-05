using Microsoft.AspNetCore.Authorization;
using System;

namespace DTC.QuanTri.Presentation.Authorization
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, Inherited = false)]
    public class HasPermissionAttribute : AuthorizeAttribute
    {
        public const string PolicyPrefix = "HasPermission_";

        public HasPermissionAttribute(string maChucNang, string maQuyen)
        {
            Policy = $"{PolicyPrefix}{maChucNang}_{maQuyen}";
        }
    }
}

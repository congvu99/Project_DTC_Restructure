using DTC.QuanTri.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.DirectoryServices.AccountManagement;

namespace DTC.QuanTri.Infrastructure.Services
{
    public class LdapService : ILdapService
    {
        private readonly string _domain;
        private readonly ILogger<LdapService> _logger;

        public LdapService(IConfiguration configuration, ILogger<LdapService> logger)
        {
            _domain = configuration["LdapSettings:Domain"] ?? "SP.local";
            _logger = logger;
        }

        public bool Authenticate(string username, string password)
        {
            try
            {
                _logger.LogInformation("Đang xác thực LDAP cho user: {Username} trên domain: {Domain}", username, _domain);

                using (var context = new PrincipalContext(ContextType.Domain, _domain))
                {
                    var result = context.ValidateCredentials(username, password);
                    
                    if (result)
                        _logger.LogInformation("Xác thực LDAP thành công cho user: {Username}", username);
                    else
                        _logger.LogWarning("Xác thực LDAP thất bại cho user: {Username}", username);
                    
                    return result;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi kết nối LDAP cho user: {Username}", username);
                return false;
            }
        }
    }
}

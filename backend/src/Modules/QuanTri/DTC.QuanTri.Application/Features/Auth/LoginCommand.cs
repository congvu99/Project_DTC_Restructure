using MediatR;
using System.Threading;
using System.Threading.Tasks;
using DTC.QuanTri.Domain.Repositories;
using DTC.QuanTri.Application.Interfaces;
using Microsoft.Extensions.Logging;

namespace DTC.QuanTri.Application.Features.Auth
{
    public class LoginCommand : IRequest<AuthResult>
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResult
    {
        public bool Success { get; set; }
        public string Token { get; set; } = string.Empty;
        public string ErrorMessage { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public int UserId { get; set; }
    }

    public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResult>
    {
        private readonly IUserRepository _userRepository;
        private readonly ILdapService _ldapService;
        private readonly ITokenService _tokenService;
        private readonly ILogger<LoginCommandHandler> _logger;

        public LoginCommandHandler(
            IUserRepository userRepository,
            ILdapService ldapService,
            ITokenService tokenService,
            ILogger<LoginCommandHandler> logger)
        {
            _userRepository = userRepository;
            _ldapService = ldapService;
            _tokenService = tokenService;
            _logger = logger;
        }

        public async Task<AuthResult> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            _logger.LogInformation("=== BẮT ĐẦU ĐĂNG NHẬP cho user: {Username} ===", request.Username);

            // Bước 1: Xác thực qua LDAP
            if (!_ldapService.Authenticate(request.Username, request.Password))
            {
                _logger.LogWarning("LDAP thất bại cho user: {Username}", request.Username);
                return new AuthResult 
                { 
                    Success = false, 
                    ErrorMessage = "Xác thực thất bại. Sai tài khoản hoặc mật khẩu." 
                };
            }

            _logger.LogInformation("LDAP thành công. Đang tìm user trong DB...");

            // Bước 2: Lấy thông tin User từ DB
            var user = await _userRepository.GetByUsernameAsync(request.Username);

            if (user == null)
            {
                _logger.LogWarning("User '{Username}' KHÔNG TÌM THẤY trong bảng QT_NguoiSuDung", request.Username);
                return new AuthResult 
                { 
                    Success = false, 
                    ErrorMessage = $"Tài khoản '{request.Username}' không tồn tại trong hệ thống DTC." 
                };
            }

            _logger.LogInformation("Tìm thấy user trong DB: ID={Id}, UserName={UserName}, Hieuluc={Hieuluc}, BitDaXoa={BitDaXoa}",
                user.Id, user.UserName, user.Hieuluc, user.BitDaXoa);

            // Hieuluc có thể là null (coi như active) hoặc false (bị khóa)
            if (user.Hieuluc == false)
            {
                _logger.LogWarning("User '{Username}' bị KHÓA (Hieuluc=false)", request.Username);
                return new AuthResult 
                { 
                    Success = false, 
                    ErrorMessage = "Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên." 
                };
            }

            // Bước 3: Tạo JWT Token thật
            var token = _tokenService.GenerateToken(user.Id, user.UserName, user.Hoten, user.DonViID);
            _logger.LogInformation("=== ĐĂNG NHẬP THÀNH CÔNG cho user: {Username}, ID={Id} ===", user.UserName, user.Id);

            return new AuthResult 
            { 
                Success = true, 
                Token = token,
                FullName = user.Hoten ?? "",
                UserId = user.Id
            };
        }
    }
}

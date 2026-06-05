namespace DTC.QuanTri.Application.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(int userId, string username, string fullName, int? donViId);
    }
}

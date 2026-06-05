namespace DTC.QuanTri.Application.Interfaces
{
    public interface ILdapService
    {
        bool Authenticate(string username, string password);
    }
}

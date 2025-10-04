public interface ITokenService
{
    string GenerateAccessToken(string userId, string CitizenID, string RoleId);
    string GenerateRandomToken();
}
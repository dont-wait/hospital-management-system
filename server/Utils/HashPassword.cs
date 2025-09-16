using System.Security.Cryptography;

namespace Utils;
public static class HashPasswordUtil
{
    private const int KeySize = 8;
    private const int SaltSize = 2;
    private const int Iterations = 350_000;
    private static readonly HashAlgorithmName HashAlgorithm = HashAlgorithmName.SHA512;

    public static string HashPassword(string password)
    {
        byte[] salt = RandomNumberGenerator.GetBytes(SaltSize);
        byte[] hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations, HashAlgorithm, KeySize);

        return $"{Convert.ToHexString(hash)}:{Convert.ToHexString(salt)}";
    }

    public static bool VerifyPassword(string password, string storedPassword)
    {
        var parts = storedPassword.Split(':');
        if (parts.Length != 2)
            throw new FormatException("Invalid stored password format.");

        byte[] hashFromDb = Convert.FromHexString(parts[0]);
        byte[] salt = Convert.FromHexString(parts[1]);

        byte[] hashToCompare = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations, HashAlgorithm, KeySize);

        return CryptographicOperations.FixedTimeEquals(hashToCompare, hashFromDb);
    }
}
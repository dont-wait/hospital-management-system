public interface IRedisService
{
    Task SetAsync(string key, string value, TimeSpan? expiry = null);
    Task SetAsync<T>(string key, T value,  TimeSpan? expiry = null);

    Task<T?> GetAsync<T>(string key);

    //Can lay cai string, vd: otp, token
    Task<string?> GetAsync(string key);
    Task RemoveAsync(string key);
    Task<T> GetOrSetAsync<T>(string key, Func<Task<T>> factory, TimeSpan? expiry = null);

    Task UpdateTimeToLiveAsync<T>(string key, T value);
}
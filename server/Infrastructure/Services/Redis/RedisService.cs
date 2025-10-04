using System.Configuration;
using System.Text.Json;
using StackExchange.Redis;

public class RedisService : IRedisService
{

    private readonly IDatabase _db; // Redis database instance

    public RedisService(IConnectionMultiplexer multiplexer)
    {
        _db = multiplexer.GetDatabase();
    }

    public async Task<string?> GetAsync(string key)
    {
        var value = await _db.StringGetAsync(key);
        return value.HasValue ? value.ToString() : null;
    }

    public async Task<T?> GetAsync<T>(string key)
    {
        var cached = await _db.StringGetAsync(key);
        if (!cached.HasValue || string.IsNullOrEmpty(cached))
            return default;
        try
        {
            var result = JsonSerializer.Deserialize<T>(cached!);
            if (result != null)
                return result;
            return default;
        }
        catch (Exception)
        {
            return default;
        }
    }

    public async Task<T> GetOrSetAsync<T>(string key, Func<Task<T>> factory, TimeSpan? expiry = null)
    {
        // Kiem tra trong redis co key chua
        var cached = await _db.StringGetAsync(key);

        if (cached.HasValue && !string.IsNullOrEmpty(cached))
        {
            var result = JsonSerializer.Deserialize<T>(cached!); //Neu co thi convert thanh Object<T>
            //Do Redis luu duoi dang key value like JSON nen can deserialize
            if (result != null)
                return result;
        }

        var value = await factory();
        var serialized = JsonSerializer.Serialize(value); //Neu khong thi goi factory de lay du lieu va luu vao redis
        await _db.StringSetAsync(key, serialized, expiry);
        return value;
    }

    public Task RemoveAsync(string key)
    {
        return _db.KeyDeleteAsync(key);
    }

    public async Task SetAsync(string key, string value, TimeSpan? expiry = null)
    {
        await _db.StringSetAsync(key, value, expiry);
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiry = null)
    {
        await _db.StringSetAsync(key, JsonSerializer.Serialize(value), expiry);
    }

    public async Task UpdateTimeToLiveAsync<T>(string key, T value)
    {
        var ttl = await _db.KeyTimeToLiveAsync(key);
        if (ttl.HasValue)
        {
            var serialized = JsonSerializer.Serialize(value);
            await _db.StringSetAsync(key, serialized, ttl);
        }
    }
}
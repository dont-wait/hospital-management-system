namespace Utils;
public class ServiceResult<T>
{
    public bool IsSuccess { get; }
    public string Message { get; }
    public T? Data { get; }

    private ServiceResult(bool isSuccess, string message, T? data)
    {
        IsSuccess = isSuccess;
        Message = message;
        Data = data;
    }

    public static ServiceResult<T> Success(T data) => new(true, "", data);
    public static ServiceResult<T> Fail(string message) => new(false, message, default);
}
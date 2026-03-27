using System.Text.Json.Serialization;

/*
    Gửi client id của request xếp lịch vừa tạo thôi, rồi client lấy id này để query tiếp,
    Lúc này server sẽ lấy response từ serverless xếp lịch, quăng full cho client
  */
public class ResponseSchedulingDTO
{
    [JsonPropertyName("request_id")]
    public string RequestId { get; set; } = String.Empty; 

    // [JsonPropertyName("status")]
    // public string Status { get; set; } = ScheduleEnum.QUEUED.ToString().ToLower();
    //
    // [JsonPropertyName("progress_percent")]
    // public int ProgressPercent { get; set; } = 0;
    //
    // [JsonPropertyName("message")]
    // public string Message { get; set; } = "Yên cầu đã được thêm vào hàng đợi";
    //
    // [JsonPropertyName("error")]
    // public string? Error { get; set; }
}

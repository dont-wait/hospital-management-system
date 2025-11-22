using System.Globalization;
public static class FormatUtil
{
    public static string FormatDate(DateOnly date)
    {
        var culture = new CultureInfo("vi-VN");
        var dateTime = date.ToDateTime(TimeOnly.MinValue);
        
        // Capitalize first letter of day name
        var formatted = dateTime.ToString("dddd, dd/MM/yyyy", culture);
        return char.ToUpper(formatted[0]) + formatted.Substring(1);
    }

    public static string FormatCurrency(double amount)
    {
        var culture = new CultureInfo("vi-VN");
        return amount.ToString("#,##0", culture) + " VNĐ";
    }
}
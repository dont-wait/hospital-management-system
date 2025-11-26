export class CurrencyUtils {
  private static viFormatter = new Intl.NumberFormat("vi", {
    style: "currency",
    currency: "vnd",
  });

  public static formatCurrency(price: number) {
    return CurrencyUtils.viFormatter.format(price);
  }
}

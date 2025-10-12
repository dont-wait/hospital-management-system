class DateService {
  static isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  static getDaysInMonth(month: string, year: string): number {
    const monthValue = parseInt(month);
    const yearValue = parseInt(year);

    if (!monthValue || !yearValue) return 31;

    switch (monthValue) {
      case 2:
        return DateService.isLeapYear(yearValue) ? 29 : 28;
      case 4:
      case 6:
      case 9:
      case 11:
        return 30;
      default:
        return 31;
    }
  }

  static validateDay(day: string, month: string, year: string): string | null {
    const dayValue = parseInt(day);

    if (!day) return null;
    if (isNaN(dayValue)) return "Ngày không hợp lệ";
    if (dayValue < 1) return "Ngày phải từ 1 trở lên";

    const maxDays = DateService.getDaysInMonth(month, year);
    if (dayValue > maxDays) {
      if (month === "02") {
        const yearNum = parseInt(year);
        if (DateService.isLeapYear(yearNum)) {
          return "Tháng 2 năm nhuận chỉ có 29 ngày";
        }
        return "Tháng 2 chỉ có 28 ngày";
      }
      return `Tháng này chỉ có ${maxDays} ngày`;
    }

    return null;
  }
}

export default DateService;

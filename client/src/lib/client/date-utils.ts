import { CalendarDay, DateTime, DateFields, DateFormatType } from "@/types";

export class DateUtils {
  public static isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  public static getDaysInMonth(month: number, year: number): number {
    const lastDay: Date = new Date(year, month, 0);
    const daysInMonth: number = lastDay.getDate();
    return daysInMonth;
  }

  public static validate(
    day: string,
    month: string,
    year: string,
  ): string | null {
    if (day === "" || month === "" || year === "") {
      return "Vui lòng điền đủ ngày tháng năm";
    }

    const dayValue = parseInt(day);
    const monthValue = parseInt(month);
    const yearValue = parseInt(year);

    if (!day) return null;
    if (isNaN(dayValue)) return "Ngày không hợp lệ";
    if (dayValue < 1) return "Ngày phải từ 1 trở lên";

    const maxDays: number = DateUtils.getDaysInMonth(monthValue, yearValue);
    const isLeapYear: boolean = DateUtils.isLeapYear(yearValue);
    const isValidDay = dayValue <= maxDays;

    if (monthValue !== 2 && !isValidDay) {
      return `Tháng này chỉ có ${maxDays} ngày`;
    }
    if (monthValue === 2 && !isValidDay) {
      if (isLeapYear) {
        return "Tháng 2 năm nhuận chỉ có 29 ngày";
      } else {
        return "Tháng 2 chỉ có 28 ngày";
      }
    }
    return null;
  }

  public static formatDay(day: string): string {
    return day.padStart(2, "0");
  }

  public static formatMonth(month: string): string {
    return month.padStart(2, "0");
  }

  public static formatDate(day: string, month: string, year: string): string {
    return `${year}-${DateUtils.formatMonth(month)}-${DateUtils.formatDay(day)}`;
  }

  public static parseDateString(date: string): DateFields {
    const dateObj: Date = new Date(date);
    return {
      day: DateUtils.formatDay(dateObj.getDate().toString()),
      month: DateUtils.formatMonth((dateObj.getMonth() + 1).toString()),
      year: dateObj.getFullYear().toString(),
    };
  }

  public static getDisplayDateTime(date: string, type: DateFormatType): string {
    if (!date) return "N/A";
    const dateObj: Date = new Date(date);
    switch (type) {
      case "DayMonth":
        return dateObj.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
        });
      case "DayMonthYear":
        return dateObj.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      case "WeekdayShort":
        return dateObj.toLocaleDateString("vi-VN", {
          weekday: "short",
        });
      case "Time":
        return dateObj.toLocaleDateString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        });
      default:
        return dateObj.toLocaleDateString("vi-VN", {
          weekday: "long",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
    }
  }

  public static isSameDate(d1: string, d2: string): boolean {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    return date1.toDateString() === date2.toDateString();
  }

  public static getWeekDays(date: Date) {
    const currentDate = new Date(date);
    const day = currentDate.getDay();
    const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1);

    const monday = new Date(currentDate.setDate(diff));
    const weekDays = [];

    for (let i = 0; i < 7; i++) {
      const weekDay = new Date(monday);
      weekDay.setDate(monday.getDate() + i);
      weekDays.push(weekDay);
    }

    return weekDays;
  }
}

export const createDays: (currentDate: Date) => (CalendarDay | null)[] = (
  currentDate: Date,
) => {
  const year: number = currentDate.getFullYear();
  const month: number = currentDate.getMonth();
  const firstDay: Date = new Date(year, month, 1);
  const lastDay: Date = new Date(year, month + 1, 0);
  const daysInMonth: number = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  const days: (CalendarDay | null)[] = [];

  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day + 1);
    const dateString = `${year}/${(month + 1).toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}`;
    const isDisabled = date <= currentDate;
    days.push({
      day: day.toString().padStart(2, "0"),
      dateString,
      isDisabled,
    });
  }

  return days;
};

export const formatDateTime: (dateTimeString: string) => DateTime | string = (
  dateTimeString: string,
) => {
  const dateObj = new Date(dateTimeString);

  if (isNaN(dateObj.getTime())) return dateTimeString;

  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();

  return {
    time: `${hours}:${minutes}`,
    date: `${day}/${month}/${year}`,
  };
};

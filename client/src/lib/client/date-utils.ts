import { CalendarDay, DateTime } from "@/types";

export const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

export const getDaysInMonth = (month: number, year: number): number => {
  if (!month || !year) return 31;

  switch (month) {
    case 2:
      return isLeapYear(year) ? 29 : 28;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
    default:
      return 31;
  }
};

export const validateDay = (
  day: string,
  month: string,
  year: string,
): string | null => {
  const dayValue = parseInt(day);
  const monthValue = parseInt(month);
  const yearValue = parseInt(year);

  if (!day) return null;
  if (isNaN(dayValue)) return "Ngày không hợp lệ";
  if (dayValue < 1) return "Ngày phải từ 1 trở lên";

  const maxDays = getDaysInMonth(monthValue, yearValue);
  if (dayValue > maxDays) {
    if (monthValue === 2) {
      return isLeapYear(yearValue)
        ? "Tháng 2 năm nhuận chỉ có 29 ngày"
        : "Tháng 2 chỉ có 28 ngày";
    }
    return `Tháng này chỉ có ${maxDays} ngày`;
  }

  return null;
};

export const formatDateString = (
  day: string,
  month: string,
  year: string,
): string => {
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

export const parseDateString = (dateString: string) => {
  const date = new Date(dateString);
  return {
    day: date.getDate().toString().padStart(2, "0"),
    month: (date.getMonth() + 1).toString().padStart(2, "0"),
    year: date.getFullYear().toString(),
  };
};

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

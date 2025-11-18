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

export const formatDateDisplay = (date: Date): string => {
  return date.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const isSameDate = (date1: Date, date2: Date): boolean => {
  return date1.toDateString() === date2.toDateString();
};

export const getDayName = (date: Date) => {
    return date.toLocaleDateString('vi-VN', { weekday: 'short' });
};

export const getDayMonth = (date: Date) => {
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
};


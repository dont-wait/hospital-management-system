export const getWeekDays = (date: Date) => {
    const current = new Date(date);
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1); // Điều chỉnh để Thứ 2 là ngày đầu tuần
    
    const monday = new Date(current.setDate(diff));
    const weekDays = [];
    
    for (let i = 0; i < 7; i++) {
        const weekDay = new Date(monday);
        weekDay.setDate(monday.getDate() + i);
        weekDays.push(weekDay);
    }
    
    return weekDays;
};

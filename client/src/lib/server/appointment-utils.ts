import { Schedule, DepartmentInfo } from "@/types";

export class AppointmentUtils {
  public static filterDepartment(schedules: Schedule[]): DepartmentInfo[] {
    const map = new Map<number, DepartmentInfo>();
    schedules.forEach((schedule) => {
      if (!map.has(schedule.departmentId)) {
        map.set(schedule.departmentId, {
          departmentId: schedule.departmentId,
          departmentName: schedule.departmentName,
          departmentDescription: schedule.departmentDescription,
        });
      }
    });
    return Array.from(map.values());
  }

  public static extractDays(schedules: Schedule[]): string[] {
    return [
      ...new Set(
        schedules.map(
          (schedule) => schedule.startTime.split("T")[0].split("-")[2],
        ),
      ),
    ];
  }
}

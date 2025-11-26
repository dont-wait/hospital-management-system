import { cookies } from "next/headers";
import SelectDepartmentOptions from "../department-option/SelectDepartmentOptions";
import PrevButton from "@/components/patient/booking/PrevButton";
import Icon from "@/components/shared/Icon";
import { AppointmentService } from "@/services/server";
import { AppointmentUtils } from "@/lib/server";
import { ApiResponse, ScheduleData, DepartmentInfo } from "@/types";
import styles from "@/styles/booking.module.css";

interface SelectDepartmentProps {
  departmentId: string;
  day: string;
}

export default async function SelectDepartment({
  departmentId,
  day,
}: SelectDepartmentProps) {
  let departments: DepartmentInfo[];
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const response: ApiResponse<ScheduleData> =
      await AppointmentService.getSchedules(token, day, departmentId);
    departments = AppointmentUtils.filterDepartment(response.data.schedules);
  } catch {
    departments = [];
  }

  return !departments.length ? (
    <div className={styles["booking-box"]}>
      <div className="p-4 w-full h-full flex flex-col justify-center items-center">
        <Icon name="BadgeAlert" className="w-40 h-40 text-east-bay" />
        <h3 className="mt-2 text-lg text center font-medium text-martinique">
          Không tìm thấy chuyên khoa phù hợp
        </h3>
      </div>

      <PrevButton />
    </div>
  ) : (
    <div className={styles["booking-box"]}>
      <h2 className={styles["booking-card-heading"]}>Chọn chuyên khoa</h2>
      <div className={styles["department-options"]}>
        <SelectDepartmentOptions departments={departments} />
      </div>
      <PrevButton />
    </div>
  );
}

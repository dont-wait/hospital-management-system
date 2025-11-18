import SelectDepartmentOptions from "../department-option/SelectDepartmentOptions";
import PrevButton from "@/components/patient/booking/PrevButton";
import { DepartmentService } from "@/services/server";
import { ApiResponse, Department } from "@/types";
import styles from "@/styles/booking.module.css";

export default async function SelectDepartment() {
  const response: ApiResponse<Department[]> =
    await DepartmentService.getDepartment();
  const departments: Department[] = response.data;
  return (
    <div className={styles["booking-box"]}>
      <h2 className={styles["booking-card-heading"]}>Chọn chuyên khoa</h2>
      <div className={styles["department-options"]}>
        <SelectDepartmentOptions departments={departments} />
      </div>
      <PrevButton />
    </div>
  );
}

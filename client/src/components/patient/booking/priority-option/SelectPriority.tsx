import SelectPriorityOptions from "./SelectPriorityOptions";
import PrevButton from "../PrevButton";
import styles from "@/styles/booking.module.css";

export default function SelectPriority() {
  return (
    <div className={styles["booking-box"]}>
      <h2 className={styles["booking-card-heading"]}>
        Chọn phương thức ưu tiên
      </h2>
      <div className={styles["priority-options"]}>
        <SelectPriorityOptions />
      </div>
      <PrevButton />
    </div>
  );
}

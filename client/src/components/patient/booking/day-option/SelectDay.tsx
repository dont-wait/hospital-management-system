import PrevButton from "@/components/patient/booking/PrevButton";
import SelectDayOptions from "./SelectDayOptions";
import styles from "@/styles/booking.module.css";
export default function SelectDay() {
  return (
    <div className={`${styles["booking-box"]} md:mx-24 lg:mx-48`}>
      <SelectDayOptions />
      <PrevButton />
    </div>
  );
}

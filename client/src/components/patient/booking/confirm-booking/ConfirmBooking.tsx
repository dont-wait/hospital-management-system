import ConfirmContent from "./ConfirmContent";
import AddBookingRecord from "../AddBookingRecord";
import ConfirmButton from "./ConfirmButton";
import styles from "@/styles/booking.module.css";

export default function ConfirmBooking() {
  return (
    <div className={styles["booking-box"]}>
      <h2 className={styles["booking-card-heading"]}>
        Xác nhận thông tin đăng ký
      </h2>
      <div className="space-y-6">
        <ConfirmContent />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
        <AddBookingRecord />
        <ConfirmButton />
      </div>
    </div>
  );
}

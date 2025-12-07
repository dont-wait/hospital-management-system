import CompletedBookingContent from "./CompletedBookingContent";
import styles from "@/styles/booking.module.css";

export default function CompletedBooking() {
  return (
    <div className={styles["booking-box"]}>
      <CompletedBookingContent/>
    </div>
  );
}


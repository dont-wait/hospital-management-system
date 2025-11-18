import PrevButton from "../PrevButton";
import BookingPaymentContent from "./BookingPaymentContent";
import styles from "@/styles/booking.module.css";

export default function BookingPayment() {
  return (
    <div className={styles["booking-box"]}>
      <h2 className={styles["booking-card-heading"]}>Thanh toán</h2>
      <BookingPaymentContent />
      <PrevButton />
    </div>
  );
}

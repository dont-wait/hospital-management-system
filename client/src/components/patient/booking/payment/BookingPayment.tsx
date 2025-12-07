import PrevButton from "../PrevButton";
import BookingPaymentContent from "./BookingPaymentContent";
import PaymentButton from "./PaymentButton";
import styles from "@/styles/booking.module.css";

export default function BookingPayment() {
  return (
    <div className={styles["booking-box"]}>
      <h2 className={styles["booking-card-heading"]}>Thanh toán</h2>
      <BookingPaymentContent />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PrevButton />
        <PaymentButton />
      </div>
    </div>
  );
}

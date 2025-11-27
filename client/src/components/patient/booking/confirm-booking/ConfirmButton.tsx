"use client";

import { useBookingExamContext } from "@/contexts";
import styles from "@/styles/booking.module.css";

export default function ConfirmButton() {
  const { confirmBooking } = useBookingExamContext();
  return (
    <button onClick={confirmBooking} className={styles["prev-button"]}>
      Xác nhận
    </button>
  );
}

"use client";

import { useBookingExamContext } from "@/contexts";
import styles from "@/styles/booking.module.css";

export default function PaymentButton() {
  const { nextStep } = useBookingExamContext();
  return (
    <button onClick={nextStep} className={styles["prev-button"]}>
      Thanh toán
    </button>
  );
}

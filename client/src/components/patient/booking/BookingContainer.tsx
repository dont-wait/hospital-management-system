"use client";

import { ReactNode } from "react";
import { BookingSteps } from "@/components/patient/booking/BookingSteps";
import { useBookingExamContext } from "@/contexts";
import styles from "@/styles/booking.module.css";

interface BookingContainer {
  children?: ReactNode[];
}

export default function BookingContainer({ children }: BookingContainer) {
  const { state } = useBookingExamContext();
  return (
    <div className={styles["booking-section"]}>
      <div className={styles["booking-content"]}>
        <BookingSteps currentStep={state.step} />
        {children && children[state.step]}
      </div>
    </div>
  );
}

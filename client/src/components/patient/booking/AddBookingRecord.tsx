"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useBookingExamContext } from "@/contexts";
import styles from "@/styles/booking.module.css";

export default function AddBookingRecord() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { addBookingRecord } = useBookingExamContext();

  const handlePrevStep = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("specialty");
    replace(`${pathname}?${params.toString()}`);
    addBookingRecord();
  };

  return (
    <button onClick={handlePrevStep} className={styles["prev-button"]}>
      Thêm chuyên khoa
    </button>
  );
}

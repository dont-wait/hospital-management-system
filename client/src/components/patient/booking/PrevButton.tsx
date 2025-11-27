"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useBookingExamContext } from "@/contexts";
import styles from "@/styles/booking.module.css";

export default function PrevButton() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { prevStep } = useBookingExamContext();

  const handlePrevStep = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("departmentId");
    params.delete("day");
    replace(`${pathname}?${params.toString()}`);
    prevStep();
  };

  return (
    <button onClick={handlePrevStep} className={styles["prev-button"]}>
      Quay lại
    </button>
  );
}

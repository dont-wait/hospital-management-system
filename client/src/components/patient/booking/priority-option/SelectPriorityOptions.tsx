"use client";

import { Icon } from "@/components";
import { priorityOptions } from "@/config";
import { useBookingExamContext } from "@/contexts";
import styles from "@/styles/booking.module.css";

export default function SelectPriorityOptions() {
  const { changeToStepTwo } = useBookingExamContext();
  return (
    <>
      {priorityOptions.map((option) => (
        <button
          type="button"
          key={option.id}
          className={styles["priority-card"]}
          onClick={() => {
            changeToStepTwo(option.id);
          }}
        >
          <div className={styles["priority-icon-bg"]}>
            <Icon name={option.iconName} className={styles["priority-icon"]} />
          </div>
          <h3 className={styles["priority-card-heading"]}>{option.label}</h3>
          <p className={styles["priority-card-desc"]}>{option.description}</p>
        </button>
      ))}
    </>
  );
}

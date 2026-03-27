'use client';

import { SoftConstraintField, SoftConstraintScheduleConfig } from "@/config";
import styles from "@/styles/create-schedule.module.css";
import { useFormContext } from "react-hook-form";


export function SoftConstraintItem({ softConstraint }: { softConstraint: SoftConstraintField }) {
  const { register } = useFormContext<SoftConstraintScheduleConfig>();
  const registerOptions = softConstraint.inputType === "number"
    ? { valueAsNumber: true }
    : undefined;

  return (
    <div className={styles["soft-constraint-item"]}>
      <div>
        <h3 className={styles["soft-constraint-item-title"]}>{softConstraint.title}</h3>
        <p className={styles["soft-constraint-item-description"]}>{softConstraint.description}</p>
      </div>
      <div>
        {softConstraint.inputType === "select" ? (
          <select
            className={styles["soft-constraint-item-control"]}
            defaultValue={softConstraint.defaultValue}
            {...register(softConstraint.key)}
          >
            {softConstraint.options?.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          <input
            type={softConstraint.inputType}
            className={styles["soft-constraint-item-control"]}
            defaultValue={softConstraint.defaultValue}
            {...register(softConstraint.key, registerOptions)}
          />
        )}
      </div>
    </div>
  );
}
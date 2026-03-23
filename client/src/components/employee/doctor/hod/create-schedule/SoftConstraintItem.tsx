'use client';

import { SoftConstraintField } from "@/config";
import styles from "@/styles/create-schedule.module.css";


export function SoftConstraintItem({ softConstraint }: { softConstraint: SoftConstraintField }) {
  return (
    <div className={styles["soft-constraint-item"]}>
      <div>
        <h3 className={styles["soft-constraint-item-title"]}>{softConstraint.title}</h3>
        <p className={styles["soft-constraint-item-description"]}>{softConstraint.description}</p>
      </div>
      <div>
        {
          softConstraint.inputType === "select" && (
            <select 
              className={styles["soft-constraint-item-control"]}
              defaultValue={softConstraint.defaultValue}
            >
              {softConstraint.options?.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          )
        }
        <input 
          type={softConstraint.inputType}
          className={styles["soft-constraint-item-control"]} 
          defaultValue={softConstraint.defaultValue}
        />
      </div>
    </div>
  );
}
'use client';
import styles from "@/styles/create-schedule.module.css";
import { ListTodo } from "lucide-react";
import { SoftConstraintField } from '@/config';
import { SoftConstraintItem } from "./SoftConstraintItem";

export function SoftConstraintCard(
  { softConstraints }: { softConstraints: SoftConstraintField[] }
) {
  return (
    <div className={styles["soft-constraint-content"]}>
      <div className={styles["schedule-container-header"]}>
        <ListTodo className="text-east-bay" /> Ràng buộc mềm
      </div>
      <div className={`${styles["card-scroll-area"]} ${styles["soft-constraint-scroll"]}`}>
        {softConstraints.map((constraint) => <SoftConstraintItem key={constraint.key} softConstraint={constraint} />)}
      </div>
    </div>
  );
}
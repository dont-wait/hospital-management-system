'use client';
import styles from "@/styles/create-schedule.module.css";
import { ListTodo } from "lucide-react";
import { SoftConstraintField } from '@/config';
import { SoftConstraintItem } from "./SoftConstraintItem";

export function SoftConstraintCard(
  { softConstraints }: { softConstraints: SoftConstraintField[] }
) {
  return (
    <div className={styles["schedule-container"] + " w-full lg:w-1/3"}>
      <div className={styles["schedule-container-header"]}>
        <ListTodo className="text-east-bay" /> Ràng buộc mềm
      </div>
      <div className="flex flex-col gap-4">
        {softConstraints.map((constraint) => <SoftConstraintItem key={constraint.key} softConstraint={constraint} />)}
      </div>
    </div>
  );
}
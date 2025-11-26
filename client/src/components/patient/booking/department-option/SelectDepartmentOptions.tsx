"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useBookingExamContext } from "@/contexts";
import { DepartmentInfo } from "@/types";
import styles from "@/styles/booking.module.css";

interface SpecialtyOptionsProps {
  departments: DepartmentInfo[];
}
export default function SelectDepartmentOptions({
  departments,
}: SpecialtyOptionsProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { setDepartment } = useBookingExamContext();
  const handleSelect = (departmentId: number, departmentName: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("departmentId", departmentId.toString());
    replace(`${pathname}?${params.toString()}`);
    setDepartment(departmentId, departmentName);
  };

  return (
    <>
      {departments.map((department) => (
        <section
          key={department.departmentId}
          className={styles["department-item"]}
          onClick={() => {
            handleSelect(department.departmentId, department.departmentName);
          }}
        >
          <h3 className="font-medium mb-1 text-lg text-martinique">
            {department.departmentName}
          </h3>
          <p className="font-extralight text-sm text-east-bay">
            {department.departmentDescription}
          </p>
        </section>
      ))}
    </>
  );
}

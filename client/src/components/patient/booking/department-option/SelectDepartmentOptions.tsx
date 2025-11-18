"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useBookingExamContext } from "@/contexts";
import { Department } from "@/types";
import styles from "@/styles/booking.module.css";

interface SpecialtyOptionsProps {
  departments: Department[];
}
export default function SelectDepartmentOptions({
  departments,
}: SpecialtyOptionsProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { setSpecialty } = useBookingExamContext();

  const handleSelect = (specialty: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("specialty", specialty);
    replace(`${pathname}?${params.toString()}`);
    setSpecialty(specialty);
  };
  return (
    <>
      {departments.map((department) => (
        <section
          key={department.departmentId}
          className={styles["department-item"]}
          onClick={() => {
            handleSelect(department.departmentName);
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

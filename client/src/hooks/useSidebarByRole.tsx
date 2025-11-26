"use client";

import { usePathname } from "next/navigation";
import { useMemo, ReactNode } from "react";
import DoctorSidebarBody from "@/components/employee/doctor/DoctorSidebarBody";
import { Roles } from "@/types";

type EmployeeRole = Exclude<Roles, "admin" | "patient" | "guest" | "hod">;

const sidebarMap: Record<EmployeeRole, ReactNode> = {
  doctor: <DoctorSidebarBody />,
};

export function useSidebarByRole(): ReactNode {
  // hook này dùng để lấy sidebar theo role
  const pathname = usePathname();

  const sidebarContent = useMemo(() => {
    const roleMatch = pathname.match(/\/(doctor)\//);

    if (roleMatch) {
      const role = roleMatch[1] as EmployeeRole;
      return sidebarMap[role];
    }

    return null;
  }, [pathname]);

  return sidebarContent;
}

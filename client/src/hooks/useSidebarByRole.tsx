"use client";

import { usePathname } from "next/navigation";
import { useMemo, ReactNode } from "react";
import { DoctorSidebar } from "@/components/emloyee/doctor/DoctorSidebar";
import { Role } from "@/types";

type EmployeeRole = Exclude<Role, "admin" | "patient" | "guest" | "hod">;

const sidebarMap: Record<EmployeeRole, ReactNode> = {
  doctor: <DoctorSidebar />,
};

export function useSidebarByRole(): ReactNode { // hook này dùng để lấy sidebar theo role
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

"use client";

import { usePathname } from "next/navigation";
import { useMemo, ReactNode } from "react";
import { DoctorSidebar } from "@/components/employee/doctor/DoctorSidebar";
import { Roles } from "@/types";

type EmployeeRole = Exclude<Roles, "admin" | "patient" | "guest" | "hod">;

const sidebarMap: Record<EmployeeRole, ReactNode> = {
  doctor: <DoctorSidebar />, // vì hod cũng dùng DoctorSidebar, khác mỗi 1 item nên không cần tạo component riêng
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

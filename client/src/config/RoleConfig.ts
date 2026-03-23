import { Roles, RolesList } from "@/types";

export const ROUTE_ROLE_MAP: Record<string, readonly Roles[]> = {
  "/": RolesList,
  "/login": ["guest"],
  "/register": ["guest"],
  "/forgot-password": RolesList,
  "/patient": ["patient"],
  "/patient/prescription": ["patient"],
  "/patient/patient-diagnosis-list": ["patient"],
  "/patient/update": ["patient"],
  "/patient/appointment-management": ["patient"],
  "/patient/booking": ["patient"],
  "/patient/billing": ["patient"],
  "/doctor/dashboard": ["doctor", "hod"],
  "/doctor/schedule": ["doctor", "hod"],
  "/doctor/create-shift": ["hod"],
  "/doctor/create-schedule": ["hod"],
  "/doctor/diagnosis": ["doctor"],
  "/admin/dashboard": ["admin"],
  "/admin/dashboard/users": ["admin"],
  "/admin/dashboard/revenue": ["admin"],
  "/sys/backups": ["sys"],
} as const;

// này mặc định khi đăng nhập sẽ chuyển đến trang nào theo role
export const DEFAULT_ROLE_ROUTES: Record<Roles, string> = {
  admin: "/admin/dashboard",
  doctor: "/doctor/dashboard",
  hod: "/doctor/dashboard",
  sys: "/sys/backups",
  patient: "/",
  guest: "/",
} as const;

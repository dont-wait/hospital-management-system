import { Roles, RolesList } from "@/types";

export const ROUTE_ROLE_MAP: Record<string, readonly Roles[]> = {
  "/": RolesList,
  "/login": ["guest"],
  "/register": ["guest"],
  "/forgot-password": RolesList,
  "/patient": ["patient"],
  "/patient/update": ["patient"],
  "/doctor/dashboard": ["doctor", "hod"],
  "/doctor/schedule": ["doctor", "hod"],
  "/doctor/create-shift": ["hod"],
  "/admin/dashboard": ["admin"],
  "/admin/dashboard/users": ["admin"],
} as const;

// này mặc định khi đăng nhập sẽ chuyển đến trang nào theo role
export const DEFAULT_ROLE_ROUTES: Record<Roles, string> = {
  admin: "/admin/dashboard",
  doctor: "/doctor/dashboard",
  hod: "/doctor/dashboard",
  patient: "/",
  guest: "/",
} as const;

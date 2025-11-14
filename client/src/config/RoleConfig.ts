import { Role, roles } from "@/types";

export const ROUTE_ROLE_MAP: Record<string, Role[]> = {
  "/": roles.slice(),
  "/login": ["guest"],
  "/register": ["guest"],
  "/forgot-password": roles.slice(),
  "/patient": ["patient"],
  "/patient/update": ["patient"],
  "/doctor/dashboard": ["doctor"],
  "/admin/dashboard": ["admin"],
  "/admin/dashboard/users": ["admin"],
} as const;

// này mặc định khi đăng nhập sẽ chuyển đến trang nào theo role
export const DEFAULT_ROLE_ROUTES: Record<Role, string> = {
  admin: "/admin/dashboard",
  doctor: "/doctor/dashboard",
  patient: "/",
  guest: "/",
} as const;

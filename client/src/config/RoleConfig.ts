import { Role } from "@/types";

const allRoles: Role[] = ["guest", "patient", "doctor", "admin"];

export const ROUTE_ROLE_MAP: Record<string, Role[]> = {
  "/": ["patient", "doctor", "guest"],
  "/login": ["guest"],
  "/register": ["guest"],
  "/forgot-password": allRoles,
  "/doctor": ["doctor"],
  "/patient": ["patient"],
  "/patient/update": ["patient"],
  "/admin/dashboard": ["admin"],
  "/admin/dashboard/users": ["admin"],
} as const;

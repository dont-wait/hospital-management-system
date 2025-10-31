import { Role } from "@/types";

const allRoles: Role[] = ["customer", "patient", "doctor", "admin"];

export const ROUTE_ROLE_MAP: Record<string, Role[]> = {
  "/": allRoles,
  "/login": ["customer"],
  "/register": ["customer"],
  "/forgot-password": allRoles,
  "/doctor": ["doctor"],
  "/patient": ["patient"],
  "/patient/update": ["patient"],
  "/admin": ["admin"],
} as const;

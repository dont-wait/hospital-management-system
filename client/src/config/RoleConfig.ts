import { Role } from "@/types";

const allRoles: Role[] = ["guest", "patient", "doctor", "admin"];

export const ROUTE_ROLE_MAP: Record<string, Role[]> = {
  "/": allRoles,
  "/login": ["guest"],
  "/register": ["guest"],
  "/forgot-password": allRoles,
  "/doctor": ["doctor"],
  "/patient": ["patient"],
  "/patient/update": ["patient"],
  "/admin": ["admin"],
} as const;

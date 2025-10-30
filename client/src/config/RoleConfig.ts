import { Role } from "@/types";

const allRoles: Role[] = ["patient", "doctor", "admin"];

export const ROUTE_ROLE_MAP: Record<string, Role[]> = {
  "/": allRoles,
  "/login": [],
  "/register": [],
  "/forgot-password": [],
  "/doctor": ["doctor"],
  "/patient": ["patient"],
  "/patient/update": ["patient"],
  "/admin": ["admin"],
} as const;

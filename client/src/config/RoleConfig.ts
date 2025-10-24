import { Role } from "@/types";

export const ROUTE_ROLE_MAP: Record<string, Role[]> = {
  "/": [],
  "/login": [],
  "/register": [],
  "/forgot-password": [],
  "/doctor": ["doctor"],
  "/patient": ["patient"],
  "/patient/update": ["patient"],
  "/admin": ["admin"],
} as const;

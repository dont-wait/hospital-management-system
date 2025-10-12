import { Role } from "@/types";

export const ROUTE_ROLE_MAP: Record<string, Role[]> = {
  "/doctor": ["doctor"],
  "/patient": ["patient"],
  "/admin": ["admin"],
} as const;

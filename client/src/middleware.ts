import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authService } from "./services/auth.service";

function decodePayload(token: string) {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("accessToken")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const payload = decodePayload(token);
  if (!payload || !payload.RoleId) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Kiểm tra hết hạn
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && now >= payload.exp) {
    authService.clearStoredUser();
    authService.clearTokens();
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Kiểm tra role
  const role = payload.RoleId as string;
  if (pathname.startsWith("/doctor") && role !== "doctor") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
  if (pathname.startsWith("/patient") && role !== "patient") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/doctor/:path*", "/patient/:path*", "/admin/:path*"],
};

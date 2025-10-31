import { NextResponse, NextRequest } from "next/server";
import { TokenUtils } from "@/lib/client";
import { MiddlewareUtils } from "@/lib/server";
import { type Role } from "@/types";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (MiddlewareUtils.shouldSkipMiddleware(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("accessToken")?.value ?? null;
  const { route: matchedRoute, roles: allowedRoles } =
    MiddlewareUtils.findMatchedRoute(pathname);

  if (!matchedRoute) {
    return NextResponse.next();
  }

  if (!token) {
    if (allowedRoles.includes("customer")) {
      return MiddlewareUtils.handleMissingToken();
    }
    return MiddlewareUtils.handleUnauthorizedAccess();
  }

  if (TokenUtils.isTokenExpired(token)) {
    return MiddlewareUtils.handleExpiredToken(req);
  }

  const userRole: Role = TokenUtils.getUserRole(token);
  if (!allowedRoles.includes(userRole)) {
    return MiddlewareUtils.handleUnauthorizedAccess();
  }

  const res = NextResponse.next();
  MiddlewareUtils.setHasTokenCookie(res, true);
  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

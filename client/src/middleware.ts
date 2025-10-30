import { NextResponse, NextRequest } from "next/server";
import { TokenUtils } from "@/lib/client";
import { MiddlewareUtils } from "@/lib/server";
import { type Role } from "@/types";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (MiddlewareUtils.shouldSkipMiddleware(pathname)) {
    return NextResponse.next();
  }

  const { route: matchedRoute, roles: allowedRoles } =
    MiddlewareUtils.findMatchedRoute(pathname);
  const token = req.cookies.get("accessToken")?.value;
  const res = NextResponse.next();

  if (!matchedRoute || allowedRoles.length === 0) {
    MiddlewareUtils.setHasTokenCookie(res, !!token);
    return res;
  }

  if (!token || TokenUtils.isTokenExpired(token)) {
    return MiddlewareUtils.handleMissingOrExpiredToken(req);
  }

  const userRole: Role = TokenUtils.getUserRole(token);
  if (!allowedRoles.includes(userRole)) {
    return MiddlewareUtils.handleUnauthorizedAccess();
  }

  MiddlewareUtils.setHasTokenCookie(res, true);
  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

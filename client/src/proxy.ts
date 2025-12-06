import { NextResponse, NextRequest } from "next/server";
import { TokenUtils } from "@/lib/client";
import { MiddlewareUtils } from "@/lib/server";
import { type Roles } from "@/types";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (MiddlewareUtils.shouldSkipMiddleware(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("accessToken")?.value ?? null;
  const { route: matchedRoute, roles: allowedRoles } =
    MiddlewareUtils.findMatchedRoute(pathname);

  if (!matchedRoute) {
    return new NextResponse(null, { status: 400 });
  }

  if (!token) {
    if (allowedRoles.includes("guest")) {
      return MiddlewareUtils.handleMissingToken();
    }
    return MiddlewareUtils.handleRedirectLogin(req);
  }

  if (TokenUtils.isTokenExpired(token)) {
    return MiddlewareUtils.handleExpiredToken(req);
  }

  const userRole: Roles = TokenUtils.getUserRole(token);
  
  // ngăn cho user đã login truy cập /login hoặc /register
  if (allowedRoles.length === 1 && allowedRoles[0] === "guest" && userRole !== "guest") {
    return MiddlewareUtils.handlePostLoginRedirect(req, userRole);
  }

  // ngăn cho user đã login truy cập trang chủ trừ guest hoặc patient
  if (pathname === "/" && userRole !== "guest" && userRole !== "patient") {
    return MiddlewareUtils.handlePostLoginRedirect(req, userRole);
  }

  if (!allowedRoles.includes(userRole)) {
    return MiddlewareUtils.handleUnauthorizedAccess(userRole);
  }

  const res = NextResponse.next();
  MiddlewareUtils.setHasTokenCookie(res, true);
  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|not-found).*)"],
};

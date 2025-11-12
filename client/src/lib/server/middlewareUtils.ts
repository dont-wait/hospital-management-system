import { NextResponse, NextRequest } from "next/server";
import { ForbiddenResponse } from "@/lib/server";
import { ROUTE_ROLE_MAP, EXCLUDED_PATHS } from "@/config";
import { type Role } from "@/types";

export class MiddlewareUtils {
  static shouldSkipMiddleware(pathname: string): boolean {
    return EXCLUDED_PATHS.some((path) => pathname.startsWith(path));
  }

  static findMatchedRoute(pathname: string): {
    route: string | null;
    roles: Role[];
  } {
    const sortedRoutes = Object.entries(ROUTE_ROLE_MAP).sort(
      ([a], [b]) => b.length - a.length,
    );

    for (const [route, roles] of sortedRoutes) {
      if (pathname === route || pathname.startsWith(`${route}/`)) {
        return { route, roles };
      }
    }

    return { route: null, roles: [] };
  }

  static setHasTokenCookie(res: NextResponse, hasToken: boolean): void {
    res.cookies.set("hasToken", String(hasToken), {
      path: "/",
      httpOnly: false,
    });
  }

  static handleMissingToken(): NextResponse {
    const redirectRes = NextResponse.next();
    redirectRes.cookies.delete("accessToken");
    redirectRes.cookies.delete("refreshToken");
    MiddlewareUtils.setHasTokenCookie(redirectRes, false);
    return redirectRes;
  }

  static handleRedirectLogin(req: NextRequest): NextResponse {
    const url = new URL("/login", req.url);
    const redirectRes = NextResponse.redirect(url);
    return redirectRes;
  }

  static handleExpiredToken(req: NextRequest): NextResponse {
    const url = new URL("/login", req.url);
    const redirectRes = NextResponse.redirect(url);
    redirectRes.cookies.delete("accessToken");
    redirectRes.cookies.delete("refreshToken");
    MiddlewareUtils.setHasTokenCookie(redirectRes, false);
    return redirectRes;
  }

  static handleUnauthorizedAccess(userRole: Role): NextResponse {
    const forbiddenRes = new NextResponse(ForbiddenResponse(userRole), {
      status: 403,
      headers: { "Content-Type": "text/html" },
    });
    MiddlewareUtils.setHasTokenCookie(forbiddenRes, true);
    return forbiddenRes;
  }
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import TokenService from "@/services/token.service";
import { ROUTE_ROLE_MAP } from "@/config/RoleConfig";
import { type Role } from "@/types";

function ForbiddenResponse() {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>403 Forbidden</title>
      <style>
        body {
          display: flex;
          height: 100vh;
          align-items: center;
          justify-content: center;
          font-family: sans-serif;
          background: #f9fafb;
        }
        .box {
          text-align: center;
          background: white;
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        h1 {
          font-size: 3rem;
          color: #dc2626;
          margin-bottom: 1rem;
        }
        p {
          color: #4b5563;
          margin-bottom: 1.5rem;
        }
        a {
          color: white;
          background: #2563eb;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          text-decoration: none;
        }
        a:hover {
          background: #1e40af;
        }
      </style>
    </head>
    <body>
      <div class="box">
        <h1>403</h1>
        <p>You don’t have permission to access this page.</p>
        <a href="/">Go Home</a>
      </div>
    </body>
  </html>
  `;
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
  if (!token || TokenService.isTokenExpired(token)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Kiểm tra role
  const userRole: Role = TokenService.getUserRole(token);
  for (const [routePrefix, allowedRoles] of Object.entries(ROUTE_ROLE_MAP)) {
    if (pathname.startsWith(routePrefix)) {
      if (!allowedRoles.includes(userRole)) {
        return new NextResponse(ForbiddenResponse(), {
          status: 403,
          headers: { "Content-Type": "text/html" },
        });
      }
      break;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/doctor/:path*", "/patient/:path*", "/admin/:path*"],
};

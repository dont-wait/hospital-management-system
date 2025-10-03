import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodePayload } from "@/lib/server/utils";
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
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Kiểm tra role
  const role = payload.RoleId as Role;
  if (pathname.startsWith("/doctor") && role !== "doctor") {
    return new NextResponse(ForbiddenResponse(), {
      status: 403,
      headers: { "Content-Type": "text/html" },
    });
  }
  if (pathname.startsWith("/patient") && role !== "patient") {
    return new NextResponse(ForbiddenResponse(), {
      status: 403,
      headers: { "Content-Type": "text/html" },
    });
  }
  if (pathname.startsWith("/admin") && role !== "admin") {
    return new NextResponse(ForbiddenResponse(), {
      status: 403,
      headers: { "Content-Type": "text/html" },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/doctor/:path*", "/patient/:path*", "/admin/:path*"],
};

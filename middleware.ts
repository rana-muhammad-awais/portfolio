import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Protect /api/ admin routes (not /api/contact which is public)
  if (
    pathname.startsWith("/api/") &&
    !pathname.startsWith("/api/contact") &&
    !pathname.startsWith("/api/auth")
  ) {
    const token = request.cookies.get("admin_token")?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/settings/:path*", "/api/projects/:path*", "/api/experience/:path*", "/api/stats/:path*", "/api/messages/:path*", "/api/upload/:path*"],
};

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-me";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Helper to verify token in Edge runtime
  async function verifyEdgeToken(token: string) {
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      return payload;
    } catch {
      return null;
    }
  }

  // Only protect /admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const decoded = await verifyEdgeToken(token);
    if (!decoded) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Protect /api/ admin routes (not /api/contact which is public)
  if (
    pathname.startsWith("/api/") &&
    !pathname.startsWith("/api/contact") &&
    !pathname.startsWith("/api/auth") &&
    !pathname.startsWith("/api/messages") && // Allow POST to /api/messages for contact form
    !(pathname.startsWith("/api/messages") && request.method === "POST")
  ) {
    // If it's a POST to /api/messages, allow it
    if (pathname === "/api/messages" && request.method === "POST") {
      return NextResponse.next();
    }
    
    // Allow public GET requests for content if needed? Wait, these are public APIs for the frontend!
    // The frontend fetches /api/projects, /api/experience, /api/stats, /api/settings.
    // If we block GET, the frontend will fail.
    // We should only block non-GET requests (POST, PUT, DELETE) on these content routes!
    if (request.method !== "GET" && pathname !== "/api/auth/login") {
      const token = request.cookies.get("admin_token")?.value;

      if (!token || !(await verifyEdgeToken(token))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*", 
    "/api/settings/:path*", 
    "/api/projects/:path*", 
    "/api/experience/:path*", 
    "/api/stats/:path*", 
    "/api/messages/:path*", 
    "/api/upload/:path*"
  ],
};

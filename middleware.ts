import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "./app/lib/auth";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  const session = token ? await verifySessionToken(token) : null;

  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isProtectedRoute = req.nextUrl.pathname.startsWith("/dashboard");

  if ((isAdminRoute || isProtectedRoute) && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAdminRoute && session?.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};

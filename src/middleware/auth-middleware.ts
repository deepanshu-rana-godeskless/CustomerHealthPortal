import { NextResponse, type NextRequest } from "next/server";

export function authMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLoggedIn = req.cookies.get("auth-token");

  // Redirect unauthenticated users to login v2
  if (!isLoggedIn && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth/v2/login", req.url));
  }

  // Redirect authenticated users from login pages to dashboard
  if (
    isLoggedIn &&
    (pathname === "/auth/v2/login" ||
      pathname === "/auth/v2/register" ||
      pathname === "/auth/v1/login" ||
      pathname === "/auth/v1/register")
  ) {
    return NextResponse.redirect(new URL("/dashboard/default", req.url));
  }

  return NextResponse.next();
}

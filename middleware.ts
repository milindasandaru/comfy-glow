import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAuth0Client } from "@/lib/auth0";

export async function middleware(request: NextRequest) {
  const fallbackUrl = new URL(request.url);
  const rawPathname = request.nextUrl?.pathname ?? fallbackUrl.pathname;
  const rawSearch = request.nextUrl?.search ?? fallbackUrl.search;
  const rawOrigin = request.nextUrl?.origin ?? fallbackUrl.origin;

  const pathname =
    typeof rawPathname === "string" ? rawPathname : String(rawPathname ?? "");
  const search =
    typeof rawSearch === "string" ? rawSearch : String(rawSearch ?? "");
  const origin =
    typeof rawOrigin === "string" ? rawOrigin : String(rawOrigin ?? "");

  const auth0 = getAuth0Client(origin);

  // Let Auth0 SDK own its endpoints
  if (pathname.startsWith("/api/auth") || pathname.startsWith("/auth")) {
    return await auth0.middleware(request);
  }

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const session = await auth0.getSession(request);
    if (!session) {
      const returnTo = `${pathname}${search}`;
      const loginUrl = new URL(
        `/api/auth/login?returnTo=${encodeURIComponent(returnTo)}`,
        request.url,
      );
      return NextResponse.redirect(loginUrl);
    }

    // Optional allowlist (comma-separated emails). If not set, allow all.
    const allowed = process.env.AUTH_ALLOWED_EMAILS;
    if (allowed) {
      const email = (session.user as { email?: string } | undefined)?.email;
      const allowlist = allowed
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
      if (!email || !allowlist.includes(email.toLowerCase())) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/auth/:path*", "/auth/:path*", "/dashboard/:path*"],
};

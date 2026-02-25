import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyRequest } from "@/lib/auth";

const GATE_SECRET = process.env.GATE_SECRET || "";
const GATE_COOKIE = "gate-access";
const GATE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function isFullyExemptPath(pathname: string): boolean {
  return (
    pathname === "/gate" ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  );
}

function isAuthExemptPath(pathname: string): boolean {
  return (
    pathname === "/login" ||
    pathname.startsWith("/api/auth/login")
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isFullyExemptPath(pathname)) {
    return NextResponse.next();
  }

  // --- Layer 1: Gate secret key check ---
  const hasGateCookie = request.cookies.get(GATE_COOKIE)?.value === "granted";
  const keyParam = request.nextUrl.searchParams.get("key");

  if (!hasGateCookie) {
    if (keyParam === GATE_SECRET && GATE_SECRET !== "") {
      const cleanUrl = request.nextUrl.clone();
      cleanUrl.searchParams.delete("key");
      const response = NextResponse.redirect(cleanUrl);
      response.cookies.set(GATE_COOKIE, "granted", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: GATE_MAX_AGE,
        path: "/",
      });
      return response;
    }

    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.redirect(new URL("/gate", request.url));
  }

  // --- Layer 2: JWT auth check (skip for login page and login API) ---
  if (isAuthExemptPath(pathname)) {
    return NextResponse.next();
  }

  const isAuthenticated = await verifyRequest(request);

  if (!isAuthenticated) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

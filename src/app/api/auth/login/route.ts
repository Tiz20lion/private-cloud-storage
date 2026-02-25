import { NextRequest, NextResponse } from "next/server";
import { createToken, getSessionCookieName } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const accessPassword = process.env.ACCESS_PASSWORD;

    if (!accessPassword) {
      return NextResponse.json({ error: "Server not configured" }, { status: 500 });
    }

    if (password !== accessPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = await createToken();
    const response = NextResponse.json({ success: true });

    response.cookies.set(getSessionCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth";
import { db, toPublicUser } from "@/lib/db";
import { setSessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const user = db.getUserByEmail(email);
  // Same error for unknown email and wrong password to avoid user enumeration.
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  await setSessionCookie(user.id);
  return NextResponse.json({ user: toPublicUser(user) });
}

import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth";
import { db, toPublicUser } from "@/lib/db";
import { loginSchema } from "@/lib/schemas";
import { setSessionCookie } from "@/lib/session";
import { parseBody } from "@/lib/validation";

export async function POST(request: Request) {
  const parsed = await parseBody(request, loginSchema);
  if (parsed.error) return parsed.error;
  const { email, password } = parsed.data;

  const user = await db.getUserByEmail(email);
  // Same error for unknown email and wrong password to avoid user enumeration.
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  await setSessionCookie(user.id);
  return NextResponse.json({ user: toPublicUser(user) });
}

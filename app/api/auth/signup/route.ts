import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { db, toPublicUser } from "@/lib/db";
import { signupSchema } from "@/lib/schemas";
import { setSessionCookie } from "@/lib/session";
import { parseBody } from "@/lib/validation";

export async function POST(request: Request) {
  const parsed = await parseBody(request, signupSchema);
  if (parsed.error) return parsed.error;
  const { name, email, password } = parsed.data;

  if (db.getUserByEmail(email)) {
    return NextResponse.json(
      { error: "An account with that email already exists." },
      { status: 409 },
    );
  }

  const user = db.createUser({ name, email, passwordHash: hashPassword(password) });
  await setSessionCookie(user.id);

  return NextResponse.json({ user: toPublicUser(user) }, { status: 201 });
}

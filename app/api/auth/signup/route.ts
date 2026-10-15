import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { db, toPublicUser } from "@/lib/db";
import { setSessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  let body: { name?: string; email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Name, email, and password are required." },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 },
    );
  }
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

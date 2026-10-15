import { NextResponse } from "next/server";
import { db, toPublicUser } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function PATCH(request: Request) {
  const current = await getCurrentUser();
  if (!current) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: { name?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = body.name?.trim();
  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  const updated = db.updateUser(current.id, { name });
  if (!updated) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  return NextResponse.json({ user: toPublicUser(updated) });
}

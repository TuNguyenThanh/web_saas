import { NextResponse } from "next/server";
import { db, toPublicUser } from "@/lib/db";
import { updateProfileSchema } from "@/lib/schemas";
import { getCurrentUser } from "@/lib/session";
import { parseBody } from "@/lib/validation";

export async function PATCH(request: Request) {
  const current = await getCurrentUser();
  if (!current) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const parsed = await parseBody(request, updateProfileSchema);
  if (parsed.error) return parsed.error;
  const { name } = parsed.data;

  const updated = await db.updateUser(current.id, { name });
  if (!updated) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  return NextResponse.json({ user: toPublicUser(updated) });
}

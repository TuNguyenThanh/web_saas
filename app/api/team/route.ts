import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inviteMemberSchema } from "@/lib/schemas";
import { getCurrentUser } from "@/lib/session";
import { parseBody } from "@/lib/validation";

/** List team members. */
export async function GET() {
  const current = await getCurrentUser();
  if (!current) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  return NextResponse.json({ members: await db.listTeamMembers() });
}

/** Invite a new team member (status: pending). */
export async function POST(request: Request) {
  const current = await getCurrentUser();
  if (!current) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const parsed = await parseBody(request, inviteMemberSchema);
  if (parsed.error) return parsed.error;
  const { email, role } = parsed.data;

  if (await db.getTeamMemberByEmail(email)) {
    return NextResponse.json(
      { error: "That person is already on the team." },
      { status: 409 },
    );
  }

  const member = await db.inviteTeamMember({ email, role });
  return NextResponse.json({ member }, { status: 201 });
}

/** Remove a team member by id (?id=...). The owner cannot be removed. */
export async function DELETE(request: Request) {
  const current = await getCurrentUser();
  if (!current) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Member id is required." }, { status: 400 });
  }

  const member = (await db.listTeamMembers()).find((m) => m.id === id);
  if (!member) {
    return NextResponse.json({ error: "Member not found." }, { status: 404 });
  }
  if (member.role === "owner") {
    return NextResponse.json({ error: "The owner cannot be removed." }, { status: 403 });
  }

  await db.removeTeamMember(id);
  return NextResponse.json({ ok: true });
}

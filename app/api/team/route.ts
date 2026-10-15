import { NextResponse } from "next/server";
import { db, type MemberRole } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

const VALID_ROLES: MemberRole[] = ["owner", "admin", "member"];

/** List team members. */
export async function GET() {
  const current = await getCurrentUser();
  if (!current) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  return NextResponse.json({ members: db.listTeamMembers() });
}

/** Invite a new team member (status: pending). */
export async function POST(request: Request) {
  const current = await getCurrentUser();
  if (!current) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: { email?: string; role?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const role = (body.role ?? "member") as MemberRole;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }
  if (!VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: "Unknown role." }, { status: 400 });
  }
  if (db.getTeamMemberByEmail(email)) {
    return NextResponse.json(
      { error: "That person is already on the team." },
      { status: 409 },
    );
  }

  const member = db.inviteTeamMember({ email, role });
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

  const member = db.listTeamMembers().find((m) => m.id === id);
  if (!member) {
    return NextResponse.json({ error: "Member not found." }, { status: 404 });
  }
  if (member.role === "owner") {
    return NextResponse.json({ error: "The owner cannot be removed." }, { status: 403 });
  }

  db.removeTeamMember(id);
  return NextResponse.json({ ok: true });
}

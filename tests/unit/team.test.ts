import { db } from "@/lib/db";

describe("team members", () => {
  it("lists seeded members with active ones first", () => {
    const members = db.listTeamMembers();
    expect(members.length).toBeGreaterThanOrEqual(3);

    const firstPendingIndex = members.findIndex((m) => m.status === "pending");
    const lastActiveIndex = members.map((m) => m.status).lastIndexOf("active");
    // Every active member sorts before every pending member.
    if (firstPendingIndex !== -1 && lastActiveIndex !== -1) {
      expect(lastActiveIndex).toBeLessThan(firstPendingIndex);
    }
  });

  it("invites a new member as pending and derives a name", () => {
    const email = `invitee-${Date.now()}@example.com`;
    const member = db.inviteTeamMember({ email, role: "member" });

    expect(member.status).toBe("pending");
    expect(member.email).toBe(email);
    expect(member.name.length).toBeGreaterThan(0);
    expect(db.getTeamMemberByEmail(email)?.id).toBe(member.id);

    db.removeTeamMember(member.id); // cleanup
  });

  it("finds members by email case-insensitively", () => {
    const email = `Case-${Date.now()}@Example.com`;
    const member = db.inviteTeamMember({ email, role: "admin" });

    expect(db.getTeamMemberByEmail(email.toLowerCase())?.id).toBe(member.id);
    expect(db.getTeamMemberByEmail(email.toUpperCase())?.id).toBe(member.id);

    db.removeTeamMember(member.id); // cleanup
  });

  it("removes a member", () => {
    const member = db.inviteTeamMember({
      email: `remove-${Date.now()}@example.com`,
      role: "member",
    });
    expect(db.removeTeamMember(member.id)).toBe(true);
    expect(db.getTeamMemberByEmail(member.email)).toBeUndefined();
    expect(db.removeTeamMember(member.id)).toBe(false); // already gone
  });
});

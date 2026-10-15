import { db } from "@/lib/db";

describe("team members (db)", () => {
  it("lists seeded members with active ones first", async () => {
    const members = await db.listTeamMembers();
    expect(members.length).toBeGreaterThanOrEqual(3);

    const firstPendingIndex = members.findIndex((m) => m.status === "pending");
    const lastActiveIndex = members.map((m) => m.status).lastIndexOf("active");
    // Every active member sorts before every pending member.
    if (firstPendingIndex !== -1 && lastActiveIndex !== -1) {
      expect(lastActiveIndex).toBeLessThan(firstPendingIndex);
    }
  });

  it("invites a new member as pending and derives a name", async () => {
    const email = `invitee-${Date.now()}@example.com`;
    const member = await db.inviteTeamMember({ email, role: "member" });

    expect(member.status).toBe("pending");
    expect(member.email).toBe(email);
    expect(member.name.length).toBeGreaterThan(0);
    expect((await db.getTeamMemberByEmail(email))?.id).toBe(member.id);

    await db.removeTeamMember(member.id); // cleanup
  });

  it("finds members by email case-insensitively", async () => {
    const email = `Case-${Date.now()}@Example.com`;
    const member = await db.inviteTeamMember({ email, role: "admin" });

    expect((await db.getTeamMemberByEmail(email.toLowerCase()))?.id).toBe(member.id);
    expect((await db.getTeamMemberByEmail(email.toUpperCase()))?.id).toBe(member.id);

    await db.removeTeamMember(member.id); // cleanup
  });

  it("removes a member", async () => {
    const member = await db.inviteTeamMember({
      email: `remove-${Date.now()}@example.com`,
      role: "member",
    });
    expect(await db.removeTeamMember(member.id)).toBe(true);
    expect(await db.getTeamMemberByEmail(member.email)).toBeUndefined();
    expect(await db.removeTeamMember(member.id)).toBe(false); // already gone
  });
});

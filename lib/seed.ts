import { hashPassword } from "./auth";
import { prisma } from "./prisma";

/**
 * Seed the database with the demo account and a few team members.
 *
 * Idempotent (upsert by email), so it is safe to run repeatedly — on first dev
 * setup, from tests, and in CI.
 */
export async function seedDatabase(): Promise<void> {
  await prisma.user.upsert({
    where: { email: "demo@acme.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@acme.com",
      passwordHash: hashPassword("password123"),
      plan: "pro",
    },
  });

  const members = [
    { name: "Demo User", email: "demo@acme.com", role: "owner", status: "active" },
    { name: "Sam Rivera", email: "sam@acme.com", role: "admin", status: "active" },
    { name: "Jordan Lee", email: "jordan@acme.com", role: "member", status: "pending" },
  ];

  for (const m of members) {
    await prisma.teamMember.upsert({
      where: { email: m.email },
      update: {},
      create: m,
    });
  }
}

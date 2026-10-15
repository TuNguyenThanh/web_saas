import { execSync } from "node:child_process";

/** Dedicated SQLite file for E2E, kept separate from the dev database. */
export const E2E_DB = "file:./e2e.db";

/**
 * Before the Playwright run: create a fresh E2E schema and seed it. The web
 * server (see playwright.config.ts) is started with the same DATABASE_URL.
 */
export default async function globalSetup() {
  execSync("npx prisma db push --force-reset --skip-generate", {
    env: { ...process.env, DATABASE_URL: E2E_DB },
    stdio: "ignore",
  });

  process.env.DATABASE_URL = E2E_DB;
  const { seedDatabase } = await import("../../lib/seed");
  const { prisma } = await import("../../lib/prisma");
  await seedDatabase();
  await prisma.$disconnect();
}

import { execSync } from "node:child_process";

const TEST_DB = "file:./test.db";

/**
 * Before the test run: create a fresh test schema and seed it. Jest runs
 * serially (maxWorkers: 1) so suites share this one seeded SQLite file.
 */
export default async function globalSetup() {
  process.env.DATABASE_URL = TEST_DB;

  execSync("npx prisma db push --force-reset --skip-generate", {
    env: { ...process.env, DATABASE_URL: TEST_DB },
    stdio: "ignore",
  });

  const { seedDatabase } = await import("../lib/seed");
  const { prisma } = await import("../lib/prisma");
  await seedDatabase();
  await prisma.$disconnect();
}

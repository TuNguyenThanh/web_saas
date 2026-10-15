import { PrismaClient } from "@prisma/client";

/**
 * A single PrismaClient instance, reused across hot-reloads in dev (Next.js
 * re-evaluates modules on every change, which would otherwise exhaust the DB
 * connection pool).
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

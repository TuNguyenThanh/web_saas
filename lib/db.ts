import type {
  User as PrismaUser,
  TeamMember as PrismaTeamMember,
} from "@prisma/client";
import { prisma } from "./prisma";

/**
 * Data access layer.
 *
 * Backed by Prisma + SQLite. The rest of the app depends only on the exported
 * `db` functions and the domain types below — not on Prisma — so the store can
 * be swapped (e.g. Postgres) by changing this file and the schema alone.
 *
 * SQLite stores plan/role/status as strings; the mappers below narrow them back
 * to the app's union types. Dates are returned as ISO strings for the client.
 */

export type Plan = "free" | "pro" | "enterprise";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  plan: Plan;
  createdAt: string;
}

export type MemberRole = "owner" | "admin" | "member";
export type MemberStatus = "active" | "pending";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  status: MemberStatus;
  invitedAt: string;
}

function toUser(row: PrismaUser): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.passwordHash,
    plan: row.plan as Plan,
    createdAt: row.createdAt.toISOString(),
  };
}

function toMember(row: PrismaTeamMember): TeamMember {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role as MemberRole,
    status: row.status as MemberStatus,
    invitedAt: row.invitedAt.toISOString(),
  };
}

export const db = {
  async getUserById(id: string): Promise<User | undefined> {
    const row = await prisma.user.findUnique({ where: { id } });
    return row ? toUser(row) : undefined;
  },

  async getUserByEmail(email: string): Promise<User | undefined> {
    const row = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    return row ? toUser(row) : undefined;
  },

  async createUser(input: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<User> {
    const row = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase(),
        passwordHash: input.passwordHash,
        plan: "free",
      },
    });
    return toUser(row);
  },

  async updateUser(
    id: string,
    patch: Partial<Pick<User, "name" | "plan">>,
  ): Promise<User | undefined> {
    try {
      const row = await prisma.user.update({ where: { id }, data: patch });
      return toUser(row);
    } catch {
      return undefined; // no row with that id
    }
  },

  // ----- Team members -----

  async listTeamMembers(): Promise<TeamMember[]> {
    const rows = await prisma.teamMember.findMany();
    // Active first, then by invite time (sorted in app code since SQLite can't
    // order by this custom status ranking).
    return rows.map(toMember).sort((a, b) => {
      if (a.status !== b.status) return a.status === "active" ? -1 : 1;
      return a.invitedAt.localeCompare(b.invitedAt);
    });
  },

  async getTeamMemberByEmail(email: string): Promise<TeamMember | undefined> {
    const row = await prisma.teamMember.findUnique({
      where: { email: email.toLowerCase() },
    });
    return row ? toMember(row) : undefined;
  },

  async inviteTeamMember(input: {
    email: string;
    role: MemberRole;
  }): Promise<TeamMember> {
    const email = input.email.toLowerCase();
    const row = await prisma.teamMember.create({
      data: {
        // Derive a display name from the email local-part until they accept.
        name: email.split("@")[0].replace(/[._-]+/g, " "),
        email,
        role: input.role,
        status: "pending",
      },
    });
    return toMember(row);
  },

  async removeTeamMember(id: string): Promise<boolean> {
    try {
      await prisma.teamMember.delete({ where: { id } });
      return true;
    } catch {
      return false; // nothing to delete
    }
  },
};

/** Strip sensitive fields before sending a user to the client. */
export function toPublicUser(user: User) {
  const { passwordHash: _passwordHash, ...rest } = user;
  return rest;
}

export type PublicUser = ReturnType<typeof toPublicUser>;

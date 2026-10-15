import { randomUUID } from "crypto";
import { hashPassword } from "./auth";

/**
 * In-memory data store.
 *
 * This is intentionally simple so the starter runs with zero setup. Data lives
 * only in the server process and resets on restart. Swap this file for a real
 * database (Prisma, Drizzle, etc.) when you're ready — the rest of the app only
 * depends on the exported `db` functions, not on how they're stored.
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

interface Store {
  users: Map<string, User>;
  usersByEmail: Map<string, string>; // email -> userId
  teamMembers: Map<string, TeamMember>;
}

// Persist across hot-reloads in dev by hanging the store off globalThis.
const globalForDb = globalThis as unknown as { __saasStore?: Store };

function createStore(): Store {
  const store: Store = {
    users: new Map(),
    usersByEmail: new Map(),
    teamMembers: new Map(),
  };

  // Seed a demo account so you can log in immediately.
  const demo: User = {
    id: randomUUID(),
    name: "Demo User",
    email: "demo@acme.com",
    passwordHash: hashPassword("password123"),
    plan: "pro",
    createdAt: new Date().toISOString(),
  };
  store.users.set(demo.id, demo);
  store.usersByEmail.set(demo.email, demo.id);

  // Seed a few team members for the dashboard.
  const seedMembers: Omit<TeamMember, "id">[] = [
    { name: "Demo User", email: "demo@acme.com", role: "owner", status: "active", invitedAt: new Date().toISOString() },
    { name: "Sam Rivera", email: "sam@acme.com", role: "admin", status: "active", invitedAt: new Date().toISOString() },
    { name: "Jordan Lee", email: "jordan@acme.com", role: "member", status: "pending", invitedAt: new Date().toISOString() },
  ];
  for (const m of seedMembers) {
    const id = randomUUID();
    store.teamMembers.set(id, { id, ...m });
  }

  return store;
}

const store = globalForDb.__saasStore ?? createStore();
if (!globalForDb.__saasStore) globalForDb.__saasStore = store;

export const db = {
  getUserById(id: string): User | undefined {
    return store.users.get(id);
  },

  getUserByEmail(email: string): User | undefined {
    const id = store.usersByEmail.get(email.toLowerCase());
    return id ? store.users.get(id) : undefined;
  },

  createUser(input: { name: string; email: string; passwordHash: string }): User {
    const email = input.email.toLowerCase();
    const user: User = {
      id: randomUUID(),
      name: input.name,
      email,
      passwordHash: input.passwordHash,
      plan: "free",
      createdAt: new Date().toISOString(),
    };
    store.users.set(user.id, user);
    store.usersByEmail.set(email, user.id);
    return user;
  },

  updateUser(id: string, patch: Partial<Pick<User, "name" | "plan">>): User | undefined {
    const user = store.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...patch };
    store.users.set(id, updated);
    return updated;
  },

  // ----- Team members -----

  listTeamMembers(): TeamMember[] {
    // Active first, then by invite time.
    return [...store.teamMembers.values()].sort((a, b) => {
      if (a.status !== b.status) return a.status === "active" ? -1 : 1;
      return a.invitedAt.localeCompare(b.invitedAt);
    });
  },

  getTeamMemberByEmail(email: string): TeamMember | undefined {
    const target = email.toLowerCase();
    return [...store.teamMembers.values()].find((m) => m.email.toLowerCase() === target);
  },

  inviteTeamMember(input: { email: string; role: MemberRole }): TeamMember {
    const email = input.email.toLowerCase();
    const member: TeamMember = {
      id: randomUUID(),
      // Derive a display name from the email local-part until they accept.
      name: email.split("@")[0].replace(/[._-]+/g, " "),
      email,
      role: input.role,
      status: "pending",
      invitedAt: new Date().toISOString(),
    };
    store.teamMembers.set(member.id, member);
    return member;
  },

  removeTeamMember(id: string): boolean {
    return store.teamMembers.delete(id);
  },
};

/** Strip sensitive fields before sending a user to the client. */
export function toPublicUser(user: User) {
  const { passwordHash: _passwordHash, ...rest } = user;
  return rest;
}

export type PublicUser = ReturnType<typeof toPublicUser>;

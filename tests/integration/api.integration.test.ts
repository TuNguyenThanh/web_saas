/**
 * API integration tests.
 *
 * These exercise the real route handlers against the real session + db layers
 * (not pure functions, not a browser). Only the cookie store from `next/headers`
 * is replaced with an in-memory jar so the full session round-trip works:
 * a handler that sets a session cookie is observable by the next handler.
 */

// Jest requires out-of-scope refs in a mock factory to be prefixed with "mock".
const mockCookieJar = new Map<string, string>();

jest.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) => {
      const value = mockCookieJar.get(name);
      return value === undefined ? undefined : { name, value };
    },
    set: (name: string, value: string) => {
      mockCookieJar.set(name, value);
    },
    delete: (name: string) => {
      mockCookieJar.delete(name);
    },
  }),
}));

import { GET as me } from "@/app/api/auth/me/route";
import { POST as login } from "@/app/api/auth/login/route";
import { POST as logout } from "@/app/api/auth/logout/route";
import { POST as signup } from "@/app/api/auth/signup/route";
import { POST as billing } from "@/app/api/billing/route";
import {
  DELETE as teamRemove,
  GET as teamList,
  POST as teamInvite,
} from "@/app/api/team/route";

const DEMO = { email: "demo@acme.com", password: "password123" };

function req(url: string, method: string, body?: unknown): Request {
  return new Request(url, {
    method,
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
}

/** Log in as the seeded demo user so the cookie jar holds a valid session. */
async function loginAsDemo() {
  const res = await login(req("http://t/api/auth/login", "POST", DEMO));
  expect(res.status).toBe(200);
}

beforeEach(() => {
  mockCookieJar.clear(); // start every test unauthenticated
});

describe("auth API", () => {
  it("signs up a new user, sets a session, and returns a sanitized user", async () => {
    const email = `new-${Date.now()}@example.com`;
    const res = await signup(
      req("http://t/api/auth/signup", "POST", {
        name: "New Person",
        email,
        password: "password123",
      }),
    );
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.user.email).toBe(email);
    expect(data.user).not.toHaveProperty("passwordHash"); // never leaked
    expect(mockCookieJar.has("session")).toBe(true); // session established

    // The established session is usable by a subsequent request.
    const meRes = await me();
    const meData = await meRes.json();
    expect(meRes.status).toBe(200);
    expect(meData.user.email).toBe(email);
  });

  it("rejects duplicate email (409) and invalid input (400)", async () => {
    const dup = await signup(
      req("http://t/api/auth/signup", "POST", {
        name: "Dup",
        email: DEMO.email, // already seeded
        password: "password123",
      }),
    );
    expect(dup.status).toBe(409);

    const badEmail = await signup(
      req("http://t/api/auth/signup", "POST", {
        name: "X",
        email: "not-an-email",
        password: "password123",
      }),
    );
    expect(badEmail.status).toBe(400);

    const shortPw = await signup(
      req("http://t/api/auth/signup", "POST", {
        name: "X",
        email: `short-${Date.now()}@example.com`,
        password: "short",
      }),
    );
    expect(shortPw.status).toBe(400);
  });

  it("logs in with correct credentials and rejects wrong ones", async () => {
    const wrong = await login(
      req("http://t/api/auth/login", "POST", { ...DEMO, password: "nope" }),
    );
    expect(wrong.status).toBe(401);
    expect(mockCookieJar.has("session")).toBe(false);

    const ok = await login(req("http://t/api/auth/login", "POST", DEMO));
    expect(ok.status).toBe(200);
    expect(mockCookieJar.has("session")).toBe(true);
  });

  it("returns 401 from /me when unauthenticated, and clears the cookie on logout", async () => {
    const unauth = await me();
    expect(unauth.status).toBe(401);

    await loginAsDemo();
    expect(mockCookieJar.has("session")).toBe(true);

    await logout();
    expect(mockCookieJar.has("session")).toBe(false);
  });
});

describe("team API", () => {
  it("requires authentication", async () => {
    const res = await teamList();
    expect(res.status).toBe(401);
  });

  it("invites, lists, and removes a member; blocks duplicates and owner removal", async () => {
    await loginAsDemo();

    const email = `int-${Date.now()}@example.com`;
    const invite = await teamInvite(
      req("http://t/api/team", "POST", { email, role: "member" }),
    );
    const invited = await invite.json();
    expect(invite.status).toBe(201);
    expect(invited.member.status).toBe("pending");

    // Listed now.
    const listRes = await teamList();
    const { members } = await listRes.json();
    expect(members.some((m: { email: string }) => m.email === email)).toBe(true);

    // Duplicate invite rejected.
    const dup = await teamInvite(
      req("http://t/api/team", "POST", { email, role: "member" }),
    );
    expect(dup.status).toBe(409);

    // Owner cannot be removed.
    const owner = members.find((m: { role: string }) => m.role === "owner");
    const ownerDel = await teamRemove(
      req(`http://t/api/team?id=${owner.id}`, "DELETE"),
    );
    expect(ownerDel.status).toBe(403);

    // The invited member can be removed.
    const del = await teamRemove(
      req(`http://t/api/team?id=${invited.member.id}`, "DELETE"),
    );
    expect(del.status).toBe(200);
  });
});

describe("billing API", () => {
  it("requires auth, validates the plan, and updates it", async () => {
    const unauth = await billing(
      req("http://t/api/billing", "POST", { plan: "pro" }),
    );
    expect(unauth.status).toBe(401);

    await loginAsDemo();

    const bad = await billing(
      req("http://t/api/billing", "POST", { plan: "ultra" }),
    );
    expect(bad.status).toBe(400);

    const ok = await billing(
      req("http://t/api/billing", "POST", { plan: "enterprise" }),
    );
    const data = await ok.json();
    expect(ok.status).toBe(200);
    expect(data.user.plan).toBe("enterprise");
    expect(data.user).not.toHaveProperty("passwordHash");

    // Restore the seeded plan so other suites are unaffected.
    await billing(req("http://t/api/billing", "POST", { plan: "pro" }));
  });
});

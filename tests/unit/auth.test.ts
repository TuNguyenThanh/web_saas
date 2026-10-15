import {
  createSessionToken,
  hashPassword,
  verifyPassword,
  verifySessionToken,
} from "@/lib/auth";

describe("password hashing", () => {
  it("verifies a correct password", () => {
    const hash = hashPassword("password123");
    expect(verifyPassword("password123", hash)).toBe(true);
  });

  it("rejects an incorrect password", () => {
    const hash = hashPassword("password123");
    expect(verifyPassword("wrong-password", hash)).toBe(false);
  });

  it("produces a unique salt per hash", () => {
    const a = hashPassword("same-password");
    const b = hashPassword("same-password");
    expect(a).not.toEqual(b); // different salts => different stored values
    expect(verifyPassword("same-password", a)).toBe(true);
    expect(verifyPassword("same-password", b)).toBe(true);
  });

  it("rejects a malformed stored hash", () => {
    expect(verifyPassword("whatever", "not-a-valid-hash")).toBe(false);
    expect(verifyPassword("whatever", "")).toBe(false);
  });
});

describe("session tokens", () => {
  it("round-trips a user id", () => {
    const token = createSessionToken("user-123");
    expect(verifySessionToken(token)).toBe("user-123");
  });

  it("returns null for an undefined/empty token", () => {
    expect(verifySessionToken(undefined)).toBeNull();
    expect(verifySessionToken("")).toBeNull();
  });

  it("rejects a tampered payload", () => {
    const token = createSessionToken("user-123");
    const [, signature] = token.split(".");
    // Re-encode a different user id but keep the old signature.
    const forgedBody = Buffer.from(
      JSON.stringify({ sub: "attacker", exp: Math.floor(Date.now() / 1000) + 1000 }),
    )
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    expect(verifySessionToken(`${forgedBody}.${signature}`)).toBeNull();
  });

  it("rejects a token with a broken signature", () => {
    const token = createSessionToken("user-123");
    const [body] = token.split(".");
    expect(verifySessionToken(`${body}.deadbeef`)).toBeNull();
  });

  it("rejects an expired token", () => {
    const realNow = Date.now;
    try {
      // Issue a token "in the past" so it's already expired now.
      Date.now = () => realNow() - 1000 * 60 * 60 * 24 * 30; // 30 days ago
      const token = createSessionToken("user-123");
      Date.now = realNow;
      expect(verifySessionToken(token)).toBeNull();
    } finally {
      Date.now = realNow;
    }
  });
});

import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";

/**
 * Minimal, dependency-free auth primitives:
 *  - password hashing with scrypt (salt stored alongside the hash)
 *  - stateless session tokens signed with HMAC-SHA256
 *
 * For production you'd typically reach for a library (e.g. bcrypt/argon2 and a
 * session/JWT library), but this keeps the starter self-contained.
 */

const SECRET = process.env.SESSION_SECRET || "dev-insecure-secret-change-me";

// ---------- Password hashing ----------

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const derived = scryptSync(password, salt, 64);
  const keyBuffer = Buffer.from(key, "hex");
  if (keyBuffer.length !== derived.length) return false;
  return timingSafeEqual(keyBuffer, derived);
}

// ---------- Session tokens ----------

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function sign(data: string): string {
  return base64url(createHmac("sha256", SECRET).update(data).digest());
}

/** Create a signed token encoding the user id and an expiry timestamp. */
export function createSessionToken(userId: string): string {
  const payload = {
    sub: userId,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  };
  const body = base64url(JSON.stringify(payload));
  return `${body}.${sign(body)}`;
}

/** Verify a token and return the user id, or null if invalid/expired. */
export function verifySessionToken(token: string | undefined): string | null {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = sign(body);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, "base64").toString("utf8")) as {
      sub: string;
      exp: number;
    };
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload.sub;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = "session";
export { SESSION_MAX_AGE_SECONDS };

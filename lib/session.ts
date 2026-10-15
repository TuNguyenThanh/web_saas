import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  verifySessionToken,
} from "./auth";
import { db, toPublicUser, type PublicUser } from "./db";

/**
 * Server-side session helpers. These run in Server Components and Route
 * Handlers (anywhere `next/headers` cookies are available).
 */

export async function setSessionCookie(userId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSessionToken(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/** Returns the signed-in user (public shape) or null. */
export async function getCurrentUser(): Promise<PublicUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const userId = verifySessionToken(token);
  if (!userId) return null;

  const user = await db.getUserById(userId);
  return user ? toPublicUser(user) : null;
}

import { NextResponse } from "next/server";
import { db, toPublicUser } from "@/lib/db";
import { changePlanSchema } from "@/lib/schemas";
import { getCurrentUser } from "@/lib/session";
import { parseBody } from "@/lib/validation";

/**
 * Change the current user's plan.
 *
 * This is where you'd integrate a real payment provider (e.g. create a Stripe
 * Checkout session and update the plan from a webhook). For the starter we just
 * update the stored plan directly.
 */
export async function POST(request: Request) {
  const current = await getCurrentUser();
  if (!current) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const parsed = await parseBody(request, changePlanSchema);
  if (parsed.error) return parsed.error;
  const { plan } = parsed.data;

  const updated = db.updateUser(current.id, { plan });
  if (!updated) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  return NextResponse.json({ user: toPublicUser(updated) });
}

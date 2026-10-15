import { NextResponse } from "next/server";
import { db, toPublicUser, type Plan } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

const VALID_PLANS: Plan[] = ["free", "pro", "enterprise"];

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

  let body: { plan?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const plan = body.plan as Plan;
  if (!VALID_PLANS.includes(plan)) {
    return NextResponse.json({ error: "Unknown plan." }, { status: 400 });
  }

  const updated = db.updateUser(current.id, { plan });
  if (!updated) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  return NextResponse.json({ user: toPublicUser(updated) });
}

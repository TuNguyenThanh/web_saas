import { NextResponse } from "next/server";
import { db, toPublicUser } from "@/lib/db";
import { changePlanSchema } from "@/lib/schemas";
import { getCurrentUser } from "@/lib/session";
import { isStripeEnabled, priceIdForPlan, stripe } from "@/lib/stripe";
import { parseBody } from "@/lib/validation";

/**
 * Change the current user's plan.
 *
 * - With Stripe configured (STRIPE_SECRET_KEY set), a paid plan returns a
 *   Checkout Session `url` for the client to redirect to; the plan is applied by
 *   the webhook (`/api/billing/webhook`) once payment completes.
 * - Without Stripe (the demo default), or for a downgrade to "free", the plan is
 *   updated directly and the updated `user` is returned.
 */
export async function POST(request: Request) {
  const current = await getCurrentUser();
  if (!current) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const parsed = await parseBody(request, changePlanSchema);
  if (parsed.error) return parsed.error;
  const { plan } = parsed.data;

  // Paid upgrade with Stripe configured → hand off to Stripe Checkout.
  if (isStripeEnabled && stripe && plan !== "free") {
    const price = priceIdForPlan(plan);
    if (!price) {
      return NextResponse.json(
        { error: "This plan is not purchasable yet." },
        { status: 400 },
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      success_url: `${appUrl}/dashboard/billing?checkout=success`,
      cancel_url: `${appUrl}/dashboard/billing?checkout=cancelled`,
      client_reference_id: current.id,
      customer_email: current.email,
      // Read back in the webhook to know who/what to update.
      metadata: { userId: current.id, plan },
      subscription_data: { metadata: { userId: current.id, plan } },
    });

    return NextResponse.json({ url: session.url });
  }

  // Fallback: no Stripe, or a downgrade to the free plan.
  const updated = await db.updateUser(current.id, { plan });
  if (!updated) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  return NextResponse.json({ user: toPublicUser(updated) });
}

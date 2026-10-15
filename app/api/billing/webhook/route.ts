import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { db, type Plan } from "@/lib/db";
import { stripe } from "@/lib/stripe";

/**
 * Stripe webhook — the authoritative source for plan changes.
 *
 * Verifies the signature against `STRIPE_WEBHOOK_SECRET`, then applies the plan
 * from the event metadata. Test locally with the Stripe CLI:
 *   stripe listen --forward-to localhost:3000/api/billing/webhook
 */
export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  // Signature verification needs the raw, unparsed body.
  const rawBody = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId ?? session.client_reference_id ?? undefined;
      const plan = session.metadata?.plan as Plan | undefined;
      if (userId && plan) {
        await db.updateUser(userId, { plan });
      }
      break;
    }
    case "customer.subscription.deleted": {
      // Subscription cancelled → downgrade to free.
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      if (userId) {
        await db.updateUser(userId, { plan: "free" });
      }
      break;
    }
    default:
      break; // ignore unhandled event types
  }

  return NextResponse.json({ received: true });
}

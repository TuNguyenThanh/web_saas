import Stripe from "stripe";
import type { Plan } from "./db";

/**
 * Stripe is optional. If `STRIPE_SECRET_KEY` is unset (the default for the demo
 * and CI), `stripe` is null and `isStripeEnabled` is false — the billing route
 * then updates the plan directly instead of creating a Checkout session.
 */
const secretKey = process.env.STRIPE_SECRET_KEY;

export const isStripeEnabled = Boolean(secretKey);

export const stripe = secretKey ? new Stripe(secretKey) : null;

/** Map a paid plan to its configured Stripe Price ID. */
export function priceIdForPlan(plan: Plan): string | undefined {
  if (plan === "pro") return process.env.STRIPE_PRICE_PRO;
  if (plan === "enterprise") return process.env.STRIPE_PRICE_ENTERPRISE;
  return undefined; // "free" has no price
}

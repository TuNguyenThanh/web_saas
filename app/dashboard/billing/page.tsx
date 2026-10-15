import type { Metadata } from "next";
import { PlanSelector } from "@/components/PlanSelector";
import { Alert } from "@/components/ui";
import { getCurrentUser } from "@/lib/session";
import { isStripeEnabled } from "@/lib/stripe";

export const metadata: Metadata = { title: "Billing" };

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) return null;

  const { checkout } = await searchParams;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          You&apos;re currently on the{" "}
          <span className="font-semibold capitalize">{user.plan}</span> plan.
        </p>
      </div>

      {checkout === "success" && (
        <Alert tone="success">
          Payment received — your plan will update once the webhook is processed.
        </Alert>
      )}
      {checkout === "cancelled" && (
        <Alert tone="info">Checkout cancelled — no changes were made.</Alert>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold">Change plan</h2>
        <PlanSelector currentPlan={user.plan} />
        <p className="mt-4 text-xs text-gray-500">
          {isStripeEnabled
            ? "Paid upgrades go through Stripe Checkout; your plan updates via webhook after payment."
            : "Stripe isn't configured, so plan changes apply instantly. Set STRIPE_SECRET_KEY to enable real Checkout."}
        </p>
      </section>
    </div>
  );
}

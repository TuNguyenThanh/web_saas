import type { Metadata } from "next";
import { PlanSelector } from "@/components/PlanSelector";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Billing" };

export default async function BillingPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          You&apos;re currently on the{" "}
          <span className="font-semibold capitalize">{user.plan}</span> plan.
        </p>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Change plan</h2>
        <PlanSelector currentPlan={user.plan} />
        <p className="mt-4 text-xs text-gray-500">
          This demo updates your plan instantly. Wire the{" "}
          <code className="rounded bg-black/5 px-1 py-0.5 dark:bg-white/10">/api/billing</code>{" "}
          route to Stripe Checkout + webhooks for real payments.
        </p>
      </section>
    </div>
  );
}

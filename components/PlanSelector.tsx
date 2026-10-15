"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Plan } from "@/lib/db";

const PLANS: { id: Plan; name: string; price: string; features: string[] }[] = [
  { id: "free", name: "Free", price: "$0/mo", features: ["3 projects", "Community support"] },
  { id: "pro", name: "Pro", price: "$29/mo", features: ["Unlimited projects", "Priority support", "Analytics"] },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    features: ["SSO & SAML", "Dedicated support", "SLA"],
  },
];

export function PlanSelector({ currentPlan }: { currentPlan: Plan }) {
  const router = useRouter();
  const [pending, setPending] = useState<Plan | null>(null);

  async function choose(plan: Plan) {
    if (plan === currentPlan) return;
    setPending(plan);

    // In a real app this would open Stripe Checkout; here we update directly.
    const res = await fetch("/api/billing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });

    setPending(null);
    if (res.ok) router.refresh();
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {PLANS.map((plan) => {
        const isCurrent = plan.id === currentPlan;
        return (
          <div
            key={plan.id}
            className={`rounded-2xl border p-6 ${
              isCurrent
                ? "border-brand-500 bg-brand-50/50 dark:bg-brand-500/10"
                : "border-black/5 bg-white dark:border-white/10 dark:bg-white/5"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{plan.name}</h3>
              {isCurrent && (
                <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-semibold text-white">
                  Current
                </span>
              )}
            </div>
            <p className="mt-2 text-2xl font-bold">{plan.price}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <span className="text-brand-600">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => choose(plan.id)}
              disabled={isCurrent || pending !== null}
              className={`mt-6 w-full rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed ${
                isCurrent
                  ? "border border-black/10 text-gray-400 dark:border-white/15"
                  : "bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-60"
              }`}
            >
              {isCurrent
                ? "Current plan"
                : pending === plan.id
                  ? "Switching…"
                  : `Switch to ${plan.name}`}
            </button>
          </div>
        );
      })}
    </div>
  );
}

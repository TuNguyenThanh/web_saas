"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Plan } from "@/lib/db";
import { Badge, Button, Card } from "@/components/ui";
import { cx } from "@/lib/cx";

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
          <Card
            key={plan.id}
            className={cx(
              isCurrent &&
                "border-brand-500 bg-brand-50/50 dark:border-brand-500 dark:bg-brand-500/10",
            )}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{plan.name}</h3>
              {isCurrent && <Badge tone="brand">Current</Badge>}
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
            <Button
              variant={isCurrent ? "secondary" : "primary"}
              onClick={() => choose(plan.id)}
              disabled={isCurrent || pending !== null}
              className="mt-6 w-full"
            >
              {isCurrent
                ? "Current plan"
                : pending === plan.id
                  ? "Switching…"
                  : `Switch to ${plan.name}`}
            </Button>
          </Card>
        );
      })}
    </div>
  );
}

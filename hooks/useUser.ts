"use client";

import { useRouter } from "next/navigation";
import useSWR from "swr";
import type { Plan, PublicUser } from "@/lib/db";
import { apiRequest } from "@/lib/fetcher";

const KEY = "/api/auth/me";

type MeResponse = { user: PublicUser | null };

/**
 * The current user + profile/plan mutations, backed by the SWR cache.
 *
 * The cache is typically seeded by the dashboard layout (see SWRProvider), so
 * `user` is available on first render. Mutations update the cache optimistically
 * and then call `router.refresh()` to keep server-rendered UI (the sidebar plan
 * badge, the greeting) in sync.
 */
export function useUser() {
  const router = useRouter();
  const { data, error, isLoading, mutate } = useSWR<MeResponse>(KEY);

  const user = data?.user ?? null;

  async function patchUser(
    request: () => Promise<PublicUser>,
    optimistic: Partial<PublicUser>,
  ) {
    await mutate(
      async () => ({ user: await request() }),
      {
        optimisticData: user ? { user: { ...user, ...optimistic } } : undefined,
        rollbackOnError: true,
        revalidate: false,
      },
    );
    router.refresh();
  }

  async function updateProfile(name: string) {
    await patchUser(async () => {
      const { user: updated } = await apiRequest<{ user: PublicUser }>(
        "/api/profile",
        { method: "PATCH", body: { name } },
      );
      return updated;
    }, { name });
  }

  async function changePlan(plan: Plan) {
    const res = await apiRequest<{ url?: string; user?: PublicUser }>(
      "/api/billing",
      { method: "POST", body: { plan } },
    );

    // Stripe configured → redirect to the hosted Checkout page; the webhook
    // applies the plan after payment.
    if (res.url) {
      window.location.href = res.url;
      return;
    }

    // Direct update (no Stripe, or a downgrade to free).
    if (res.user) {
      await mutate({ user: res.user }, { revalidate: false });
      router.refresh();
    }
  }

  return { user, error, isLoading, updateProfile, changePlan };
}

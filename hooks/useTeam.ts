"use client";

import useSWR from "swr";
import type { MemberRole, TeamMember } from "@/lib/db";
import { apiRequest } from "@/lib/fetcher";

const KEY = "/api/team";

type TeamResponse = { members: TeamMember[] };

/** Derive a display name from an email, mirroring the server's behaviour. */
function nameFromEmail(email: string): string {
  return email.split("@")[0].replace(/[._-]+/g, " ");
}

/**
 * Team roster + mutations, backed by the SWR cache.
 *
 * `invite` and `remove` apply an optimistic update so the UI responds
 * instantly, then reconcile with the server (rolling back on error).
 *
 * @param fallbackData members fetched on the server, to seed the cache.
 */
export function useTeam(fallbackData?: TeamMember[]) {
  const { data, error, isLoading, mutate } = useSWR<TeamResponse>(
    KEY,
    fallbackData ? { fallbackData: { members: fallbackData } } : undefined,
  );

  const members = data?.members ?? [];

  async function invite(email: string, role: MemberRole) {
    const optimistic: TeamMember = {
      id: `temp-${Date.now()}`,
      name: nameFromEmail(email),
      email,
      role,
      status: "pending",
      invitedAt: new Date().toISOString(),
    };

    await mutate(
      async (current) => {
        const { member } = await apiRequest<{ member: TeamMember }>(KEY, {
          method: "POST",
          body: { email, role },
        });
        const base = current?.members ?? members;
        return { members: [...base, member] };
      },
      {
        optimisticData: { members: [...members, optimistic] },
        rollbackOnError: true,
        revalidate: false,
      },
    );
  }

  async function remove(id: string) {
    await mutate(
      async (current) => {
        await apiRequest(`${KEY}?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
        const base = current?.members ?? members;
        return { members: base.filter((m) => m.id !== id) };
      },
      {
        optimisticData: { members: members.filter((m) => m.id !== id) },
        rollbackOnError: true,
        revalidate: false,
      },
    );
  }

  return { members, error, isLoading, invite, remove };
}

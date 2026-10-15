import type { Metadata } from "next";
import { TeamManager } from "@/components/TeamManager";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Team" };

export default async function TeamPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const members = await db.listTeamMembers();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Team</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Invite teammates and manage access to your workspace.
        </p>
      </div>

      <TeamManager initialMembers={members} />
    </div>
  );
}

"use client";

import { useState } from "react";
import type { MemberRole, TeamMember } from "@/lib/db";
import { Alert, Badge, Button, Card, Field, Input, Select } from "@/components/ui";
import { useTeam } from "@/hooks/useTeam";

const ROLES: MemberRole[] = ["admin", "member"];

export function TeamManager({ initialMembers }: { initialMembers: TeamMember[] }) {
  const { members, invite: inviteMember, remove } = useTeam(initialMembers);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MemberRole>("member");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function invite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await inviteMember(email, role);
      setEmail("");
      setRole("member");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the invite.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Invite form */}
      <Card padding="sm">
        <form
          onSubmit={invite}
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <Field id="invite-email" label="Invite by email" className="flex-1">
            <Input
              id="invite-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teammate@company.com"
            />
          </Field>
          <Field id="invite-role" label="Role" className="sm:w-40">
            <Select
              id="invite-role"
              value={role}
              onChange={(e) => setRole(e.target.value as MemberRole)}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r[0].toUpperCase() + r.slice(1)}
                </option>
              ))}
            </Select>
          </Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Sending…" : "Send invite"}
          </Button>
        </form>
      </Card>

      {error && <Alert tone="error">{error}</Alert>}

      {/* Members list */}
      <Card padding="none" className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/5 text-left text-xs uppercase tracking-wide text-gray-500 dark:border-white/10">
              <th className="px-5 py-3 font-medium">Member</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/10">
            {members.map((m) => (
              <tr key={m.id} data-testid="team-member">
                <td className="px-5 py-3">
                  <div className="font-medium capitalize">{m.name}</div>
                  <div className="text-xs text-gray-500">{m.email}</div>
                </td>
                <td className="px-5 py-3 capitalize text-gray-600 dark:text-gray-300">{m.role}</td>
                <td className="px-5 py-3">
                  <Badge
                    tone={m.status === "active" ? "success" : "warning"}
                    className="capitalize"
                  >
                    {m.status}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-right">
                  {m.role !== "owner" && (
                    <button
                      onClick={() => remove(m.id)}
                      className="text-xs font-medium text-red-600 hover:underline dark:text-red-400"
                      aria-label={`Remove ${m.email}`}
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

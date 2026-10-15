"use client";

import { useState } from "react";
import type { MemberRole, TeamMember } from "@/lib/db";
import { Button } from "./Button";

const ROLES: MemberRole[] = ["admin", "member"];

export function TeamManager({ initialMembers }: { initialMembers: TeamMember[] }) {
  const [members, setMembers] = useState(initialMembers);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MemberRole>("member");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function invite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Could not send the invite.");
      return;
    }
    setMembers((prev) => [...prev, data.member]);
    setEmail("");
    setRole("member");
  }

  async function remove(id: string) {
    const res = await fetch(`/api/team?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
    }
  }

  const inputClass =
    "w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-white/15 dark:bg-white/5 dark:text-white";

  return (
    <div className="space-y-6">
      {/* Invite form */}
      <form
        onSubmit={invite}
        className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:flex-row sm:items-end dark:border-white/10 dark:bg-white/5"
      >
        <div className="flex-1">
          <label htmlFor="invite-email" className="mb-1.5 block text-sm font-medium">
            Invite by email
          </label>
          <input
            id="invite-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="teammate@company.com"
            className={inputClass}
          />
        </div>
        <div className="sm:w-40">
          <label htmlFor="invite-role" className="mb-1.5 block text-sm font-medium">
            Role
          </label>
          <select
            id="invite-role"
            value={role}
            onChange={(e) => setRole(e.target.value as MemberRole)}
            className={inputClass}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r[0].toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Sending…" : "Send invite"}
        </Button>
      </form>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </p>
      )}

      {/* Members list */}
      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
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
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${
                      m.status === "active"
                        ? "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
                    }`}
                  >
                    {m.status}
                  </span>
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
      </div>
    </div>
  );
}

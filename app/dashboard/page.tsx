import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Overview" };

const stats = [
  { label: "Active projects", value: "12", change: "+2 this week" },
  { label: "API requests", value: "48.2k", change: "+18% vs last month" },
  { label: "Team members", value: "7", change: "+1 pending invite" },
  { label: "Storage used", value: "64 GB", change: "of 100 GB" },
];

const activity = [
  { who: "You", action: "created project “Aurora”", when: "2h ago" },
  { who: "Sam Rivera", action: "deployed to production", when: "5h ago" },
  { who: "System", action: "nightly backup completed", when: "Yesterday" },
  { who: "Jordan Lee", action: "invited to the workspace", when: "2d ago" },
];

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {user?.name.split(" ")[0]} 👋
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Here&apos;s what&apos;s happening in your workspace today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5"
          >
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">{s.value}</p>
            <p className="mt-1 text-xs text-gray-500">{s.change}</p>
          </div>
        ))}
      </div>

      {/* Activity */}
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
        <h2 className="text-lg font-semibold">Recent activity</h2>
        <ul className="mt-4 divide-y divide-black/5 dark:divide-white/10">
          {activity.map((a, i) => (
            <li key={i} className="flex items-center justify-between py-3 text-sm">
              <span>
                <span className="font-medium">{a.who}</span>{" "}
                <span className="text-gray-600 dark:text-gray-400">{a.action}</span>
              </span>
              <span className="text-xs text-gray-500">{a.when}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

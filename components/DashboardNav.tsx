"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Overview", icon: "📊" },
  { href: "/dashboard/team", label: "Team", icon: "👥" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
  { href: "/dashboard/billing", label: "Billing", icon: "💳" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {links.map((link) => {
        const active =
          link.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
              active
                ? "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
                : "text-gray-600 hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/10"
            }`}
          >
            <span aria-hidden>{link.icon}</span>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

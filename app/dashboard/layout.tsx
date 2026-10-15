import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/DashboardNav";
import { LogoutButton } from "@/components/LogoutButton";
import { Logo } from "@/components/Logo";
import { SWRProvider } from "@/components/providers/SWRProvider";
import { getCurrentUser } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authoritative session check (the middleware only checks cookie presence).
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard");

  return (
    <SWRProvider fallback={{ "/api/auth/me": { user } }}>
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-black/5 bg-white/50 p-4 md:flex dark:border-white/10 dark:bg-white/5">
        <Link href="/" className="mb-8 flex items-center gap-2 px-2">
          <Logo />
          <span className="text-lg font-bold tracking-tight">Nimbus</span>
        </Link>

        <DashboardNav />

        <div className="mt-auto border-t border-black/5 pt-4 dark:border-white/10">
          <div className="mb-2 px-3">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-gray-500">{user.email}</p>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-black/5 px-6 dark:border-white/10 md:justify-end">
          <Link href="/" className="flex items-center gap-2 md:hidden">
            <Logo className="h-7 w-7" />
            <span className="font-bold">Nimbus</span>
          </Link>
          <span className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold capitalize text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300">
            {user.plan} plan
          </span>
        </header>
        <main className="flex-1 p-6 sm:p-8">{children}</main>
      </div>
    </div>
    </SWRProvider>
  );
}

import type { Metadata } from "next";
import { ProfileForm } from "@/components/ProfileForm";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Manage your profile and account preferences.
        </p>
      </div>

      <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
        <h2 className="text-lg font-semibold">Profile</h2>
        <p className="mt-1 text-sm text-gray-500">Update your personal information.</p>
        <div className="mt-6">
          <ProfileForm initialName={user.name} email={user.email} />
        </div>
      </section>

      <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm dark:border-red-500/20 dark:bg-white/5">
        <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">Danger zone</h2>
        <p className="mt-1 text-sm text-gray-500">
          Deleting your account is permanent and cannot be undone.
        </p>
        <button
          type="button"
          className="mt-4 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/40 dark:hover:bg-red-500/10"
        >
          Delete account
        </button>
      </section>
    </div>
  );
}

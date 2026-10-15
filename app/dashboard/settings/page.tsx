import type { Metadata } from "next";
import { ProfileForm } from "@/components/ProfileForm";
import { Button, SectionCard } from "@/components/ui";
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

      <SectionCard title="Profile" description="Update your personal information.">
        <ProfileForm initialName={user.name} email={user.email} />
      </SectionCard>

      <SectionCard
        tone="danger"
        title="Danger zone"
        description="Deleting your account is permanent and cannot be undone."
      >
        <Button
          type="button"
          variant="secondary"
          className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-500/40 dark:text-red-400 dark:hover:bg-red-500/10"
        >
          Delete account
        </Button>
      </SectionCard>
    </div>
  );
}

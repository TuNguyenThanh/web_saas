"use client";

import { useState } from "react";
import { Button, Field, Input } from "@/components/ui";
import { useUser } from "@/hooks/useUser";

export function ProfileForm({
  initialName,
  email,
}: {
  initialName: string;
  email: string;
}) {
  const { updateProfile } = useUser();
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await updateProfile(name);
      setMessage("Profile updated.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not update profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-4">
      <Field id="name" label="Full name">
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </Field>

      <Field
        id="email"
        label="Email"
        hint="Email cannot be changed in this demo."
      >
        <Input id="email" value={email} disabled />
      </Field>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={loading || name.trim() === initialName}>
          {loading ? "Saving…" : "Save changes"}
        </Button>
        {message && <span className="text-sm text-gray-600 dark:text-gray-400">{message}</span>}
      </div>
    </form>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./Button";

export function ProfileForm({
  initialName,
  email,
}: {
  initialName: string;
  email: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    setLoading(false);
    if (res.ok) {
      setMessage("Profile updated.");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setMessage(data.error || "Could not update profile.");
    }
  }

  const inputClass =
    "w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 disabled:opacity-60 dark:border-white/15 dark:bg-white/5 dark:text-white";

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-4">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
          Full name
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
          Email
        </label>
        <input id="email" value={email} disabled className={inputClass} />
        <p className="mt-1 text-xs text-gray-500">Email cannot be changed in this demo.</p>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={loading || name.trim() === initialName}>
          {loading ? "Saving…" : "Save changes"}
        </Button>
        {message && <span className="text-sm text-gray-600 dark:text-gray-400">{message}</span>}
      </div>
    </form>
  );
}

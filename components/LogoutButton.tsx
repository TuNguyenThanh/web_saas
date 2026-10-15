"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      disabled={loading}
      className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-600 transition hover:bg-black/5 disabled:opacity-60 dark:text-gray-300 dark:hover:bg-white/10"
    >
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}

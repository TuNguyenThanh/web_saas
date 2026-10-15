"use client";

import { useEffect } from "react";
import { Button } from "@/components/Button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-black/5 bg-white/50 py-16 text-center dark:border-white/10 dark:bg-white/5">
      <h2 className="text-xl font-bold tracking-tight">
        Couldn&apos;t load this page
      </h2>
      <p className="mt-2 max-w-sm text-sm text-gray-600 dark:text-gray-400">
        Something went wrong while loading your dashboard. Please try again.
      </p>
      <div className="mt-6">
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
